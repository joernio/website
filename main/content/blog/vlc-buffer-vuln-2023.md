---
title: "VLC Automatic Updater Buffer Overflow Vulnerability"
date: 2021-05-11
author: "Fabian Yamaguchi"
email: "fabs@whirlylabs.com"
---

[VLC 3.0.13 fixes a vulnerability](https://www.videolan.org/security/sb-vlc3013.html) that we identified automatically using [joern-scan](https://docs.joern.io/scan/) and reported a few weeks back. In particular, the following query that is part of joern-scan's default bundle pointed to the flaw.

{{< highlight scala >}}
{val src =
  cpg.method(".*malloc$").callIn.where(_.argument(1).arithmetics).l

cpg.method("(?i)memcpy").callIn.l.filter { memcpyCall =>
  memcpyCall
    .argument(1)
    .reachableBy(src)
    .where(_.inAssignment.target.codeExact(memcpyCall.argument(1).code))
    .whereNot(_.argument(1).codeExact(memcpyCall.argument(3).code))
    .hasNext
}}.l
{{< /highlight >}}

You can find the vulnerability by running:

{{< highlight bash >}}
joern-scan --updatedb
joern-scan <path/to/vlc-source-code>l
{{< /highlight >}}

In particular, the following finding is reported:
{{< highlight bash >}}
...
Result: 4.0 : Dangerous copy-operation into heap-allocated buffer: /home/user/vlc-3.0.12/src/misc/update_crypto.c:694:parse_public_key
...
{{< /highlight >}}

You can find more queries at: https://queries.joern.io. You can share your queries with the
community by opening pull requests to https://github.com/joernio/query-database/.

Today, we are publishing the original vulnerability report as well as a PoC.

# Original Report

I would like to report a buffer overflow vulnerability in the latest stable release of the VLC Media
Player (version 3.0.12). The buffer overflow is located in the automatic updater. As is the case for
CVE-2014-9625 - a similar but different flaw - the vulnerability can potentially be exploited by a
man-in-the-middle attacker, e.g., the operator of a rogue access point or HTTP proxy used by the
victim.

The vulnerability was identified with the open-source scanner ```joern-scan``` (see
https://joern.io) and a proof-of-concept exploit was implemented to confirm the issue.

## How automated updates work in VLC

Automatic updates are carried out in two steps. First, a status file is fetched to determine whether
an update is available. Only if this is the case, the update is downloaded. Both steps are carried
out via unencrypted HTTP, however, the integrity of both the status and the update file are verified
by determining whether their contents has been signed with the private key associated with a public
key embedded into the VLC code. Unfortunately, prior to any of this verification, a heap-based
buffer overflow can be triggered.

Fetching and verification of the status file is implemented as follows:

1. The status file is fetched via HTTP
2. A signature for the status file is fetched via HTTP
3. The signature's issuer id is compared to that of an embedded key
4. If the ids do not match, the issuer public key is downloaded via HTTP and parsed.
5. The downloaded public key is verified by determining whether it is signed with the private key
   associated with the embedded public key.
6. The integrity of the status file is validated by checking whether it was signed with the private
   key associated with the downloaded public key, or the embedded public key if no key needed to be
   downloaded.

The overflow can be triggered via a specifically crafted public key, that is, it occurs while
parsing the public key in step 5 - prior to validation of the key or status file in steps 6 and 7.

## Vulnerability

As reported by ```joern```, a dangerous copy-operation into a heap-allocated buffer exists in file
```vlc-3.0.12/src/misc/update_crypto.c``` on line 694 in function ```parse_public_key```:

{{< highlight c >}}

54 #define packet_header_len( c ) ( ( c & 0x03 ) + 1 )
...

static inline int scalar_number( const uint8_t *p, int header_len )
58 {
    assert( header_len == 1 || header_len == 2 || header_len == 4 );

    if( header_len == 1 )
        return( p[0] );
    else if( header_len == 2 )
        return( (p[0] << 8) + p[1] );
    else if( header_len == 4 )
        return( (p[0] << 24) + (p[1] << 16) + (p[2] << 8) + p[3] );
    else
        abort();
69 }
...

646     int i_header_len = packet_header_len( *pos++ );
        if( pos + i_header_len > max_pos ||
            ( i_header_len != 1 && i_header_len != 2 && i_header_len != 4 ) )
            goto error;

651     int i_packet_len = scalar_number( pos, i_header_len );
        pos += i_header_len;

        if( pos + i_packet_len > max_pos )
            goto error;

        switch( i_type )
        {
	...
	 case USER_ID_PACKET:
                if( p_key->psz_username ) /* save only the first User ID */
                    break;
                i_status |= USER_ID_FOUND;
690             p_key->psz_username = (uint8_t*)malloc( i_packet_len + 1);
                if( !p_key->psz_username )
                    goto error;

694             memcpy( p_key->psz_username, pos, i_packet_len );
                p_key->psz_username[i_packet_len] = '\0';
                break;

     }
     pos += i_packet_len;
{{< /highlight >}}

On line 646, ```pos``` points to the attacker-controlled public key, and we choose its first byte to
be 3, such that ```packet_header_len``` returns 4, and this ```i_header_len``` is equal to 4. In
consequence, the function ```scalar_number``` called on line 651 returns the next 4 bytes and stores
it in ```i_packet_len```. We choose these four bytes to each be 0xff, and this, ```i_packet_len```
is -1. In effect, the buffer ```p_key->psz_username``` is allocated to have approximately 0 bytes on
line 690, yet SIZE_MAX bytes are copied into the buffer on line 694, causing an overflow.

## Steps for reproduction on Linux

While the updater should run by itself every now and then, it can also be triggered by pressing the
button "Check for updates" in the UI.

* To simulate the rogue access point, we simply point all VLC related domains to localhost by
  editing /etc/hosts, that is, we add the following lines:

{{< highlight html >}}
127.0.0.1       update-test.videolan.org
127.0.0.1       update.videolan.org
127.0.0.1       download.videolan.org
{{< /highlight >}}

The update functionality is available by default on Windows, but not on Linux, so make sure to build
VLC with --enable-update-check.

* Extract the
  [overflow-trigger-server.tar.gz](https://drive.google.com/file/d/1QIpMddLbx-WBD5hJQJ8Xs4--TXjdjCD9/view?usp=sharing)
  and launch the server

{{< highlight html >}}
tar xfz overflow-trigger-server.tar.gz
cd overflow-trigger-server
sudo python3 ./mserver.py
{{< /highlight >}}

* Launch VLC in gdb and click on "Check for updates". This should produce the following stack trace:

{{< highlight html >}}
Thread 36 "vlc" received signal SIGSEGV, Segmentation fault.
[Switching to Thread 0x7fff947f8700 (LWP 1920)]
__memmove_avx_unaligned_erms ()
    at ../sysdeps/x86_64/multiarch/memmove-vec-unaligned-erms.S:494
494	../sysdeps/x86_64/multiarch/memmove-vec-unaligned-erms.S: No such file or directory.
(gdb) bt
#0  0x00007ffff7510cfa in __memmove_avx_unaligned_erms () at ../sysdeps/x86_64/multiarch/memmove-vec-unaligned-erms.S:494
#1  0x00007ffff70e7002 in parse_public_key (p_key_data=0x7fff30045170 "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nt/////9UAGoBEACuk6ze2V2pZtScf1Ul25N2CX19AeL7sVYwnyrTYuWdG2FmJx4x\nDLTLVUazp2AEm/JhskulL/7VCZPyg7ynf+o20Tu9/6zUD7p0rnQA2k3Dz+7dKHHh\neEsIl5EZyFy1XodhUnEIjel2nGe6f1OO"..., i_key_len=20640, p_key=0x7fff3003c6e0, p_sig_issuer=0x7ffff712c6a8 <videolan_public_key_longid> "q\200q;\345\215", <incomplete sequence \334>) at misc/update_crypto.c:694
#2  0x00007ffff70e82b3 in download_key (p_this=0x55555575abb0, p_longid=0x7fff947f7c06 "q\200q;\345A", <incomplete sequence \334>, p_signature_issuer=0x7ffff712c6a8 <videolan_public_key_longid> "q\200q;\345\215", <incomplete sequence \334>) at misc/update_crypto.c:979
#3  0x00007ffff70e3b5d in GetUpdateFile (p_update=0x7fffc000d270) at misc/update.c:309
#4  0x00007ffff70e412b in update_CheckReal (obj=0x7fffc85165c0) at misc/update.c:426
#5  0x00007ffff797e6db in start_thread (arg=0x7fff947f8700) at pthread_create.c:463
#6  0x00007ffff74a371f in clone () at ../sysdeps/unix/sysv/linux/x86_64/clone.S:95
{{< /highlight >}}