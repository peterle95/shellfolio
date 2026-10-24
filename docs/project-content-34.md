# Approved project content: issue #34

Content handoff for [#34](https://github.com/peterle95/shellfolio/issues/34),
part of [#33](https://github.com/peterle95/shellfolio/issues/33).

## Owner approval and release exception

On 2026-10-22, the owner approved the following through the implementation
conversation:

- All seven mobile descriptions below.
- One shared Finance Tracker video for all seven displayed entries, including
  More Projects. No entries remain text-only in this release.
- The complete video/poster content set, the frame at 18 seconds, and the text
  alternatives below for public use.
- An **approved release exception** to #34's original requirement for actual
  per-project assets with no temporary placeholders. The owner requested a
  shared placeholder for now and deferred project-specific replacements.
- No music playback. The delivery copy removes the audio track rather than
  relying on a player mute setting. The original owner file stays untouched
  locally and is not part of the committed release package.

This exception changes the asset prerequisite in #33 and #34. It does not
authorize showcase implementation as part of this content ticket. The shared
clip depicts Finance Tracker, not the seven projects below; implementation
must identify it as a shared placeholder rather than imply otherwise.

## Approved mobile copy and project mapping

Use the exact existing titles and order from
[`src/lib/portfolio-data.ts`](../src/lib/portfolio-data.ts). Each row uses
`shared-finance-demo`, defined in the asset inventory below.

| Existing project title | Approved mobile description | Media |
| --- | --- | --- |
| FermentStation | Track fermentation locally, on desktop or Android. | shared-finance-demo |
| WEB CONSULTANT & DEVELOPER – I PELOSETTI DI SILVANA ONLUS | Pro-bono WordPress fixes for animal listings and SEO. | shared-finance-demo |
| Printing Press CLIs | 23 command-line tools for API automation. | shared-finance-demo |
| Transcendence | A multi-game platform built at 42, currently in development. | shared-finance-demo |
| Webserv | A custom HTTP server built in C++98. | shared-finance-demo |
| Shellfolio | An interactive portfolio styled as a command-line shell. | shared-finance-demo |
| More Projects | Explore more projects and contributions on GitHub. | shared-finance-demo |

Preserve existing desktop descriptions, titles, ordering, stacks, repository
and live-link meanings. Do not turn `#` link values into actionable links.
Keep cub3d and Minishell excluded: the current data comments them out.
This handoff does not change project data, virtual project filenames, or
serialized records.

## Release asset inventory

### shared-finance-demo

The release package contains these two local delivery files alongside this
handoff. Implementation can access them without external services or
owner-machine paths:

| Role | Repository path | Public URL | Format | Dimensions / ratio | Size | Duration |
| --- | --- | --- | --- | --- | --- | --- |
| Silent video | [`public/videos/finance_tracker-silent.mp4`](../public/videos/finance_tracker-silent.mp4) | `/videos/finance_tracker-silent.mp4` | MP4, H.264 High, `avc1.640028`, yuv420p; no audio | 1920 × 1080, 16:9, square pixels, 30 fps | 3,061,715 bytes | 22.000 seconds, 660 frames |
| Poster | [`public/videos/finance_tracker-poster.webp`](../public/videos/finance_tracker-poster.webp) | `/videos/finance_tracker-poster.webp` | Static WebP | 1280 × 720, 16:9 | 26,460 bytes | Single frame at source time 00:18.000 |

SHA-256 file hashes:

```text
682a05c1b387e8b5b3c2f45fcd911f9c4fa529357afc13914a22c8b7b3f3ff87  public/videos/finance_tracker-silent.mp4
ffb5ce198ad2b6478b2ba4579eac58eef88d9d6414596527929887b9f6539665  public/videos/finance_tracker-poster.webp
```

The poster shows Finance Tracker branding beside a dashboard with a €39.80
daily target and a grocery expense. The clip also shows expense entry,
budget information, and savings progress. The footage labels the values as
fictional demo data; the owner approved public use. No standalone project
images or other release videos accompany this package.

## Text alternatives and accessibility

Owner-approved poster alternative:

> Shared placeholder: Finance Tracker dashboard with a daily spending target and expense list.

Owner-approved video text alternative:

> Shared Finance Tracker demo, not a preview of this project. The clip records a grocery expense and shows a daily spending allowance, savings progress, and budget overview using fictional data.

Make the video alternative available without playback. Use the poster
alternative as image alt text where applicable; a native video poster has
no `alt` attribute, so provide an accessible video label/description and
adjacent text instead. Identify Play controls with their project context
and the shared-placeholder status.

The owner reported music in the original and requested that it not play.
The delivery file contains one video stream and **zero audio streams**;
it cannot play music even if a visitor unmutes the player. No audio captions
accompany this silent copy. Reassess captions and other audio alternatives
before accepting replacement media with speech or meaningful sound.

Keep the approved #33 playback requirements: explicit Play, no video-byte
requests before that action, no autoplay, native controls and fullscreen
after Play. Use the poster dimensions to reserve space and provide responsive
poster delivery during the separate feature implementation. This content
ticket makes no claim about browser loading or playback behavior.

## Provenance and verification

The owner supplied
`C:\Users\molze\GitHub\shellfolio\public\videos\finance_tracker.mp4`.
That local source is 3,620,368 bytes: a 22-second, 1920 × 1080, 30 fps MP4
with H.264 video and stereo AAC-LC audio at 48 kHz. Its SHA-256 is
`bb7894949d51c06f7d5ac94f2745d1688d104947c22a59e93b2f19ddbc385e5b`.
Do not use that audio-bearing source as the release video.

FFmpeg commands used to derive the release files without changing the source:

```sh
ffmpeg -i public/videos/finance_tracker.mp4 -map 0:v:0 -c:v copy -an -map_metadata -1 -movflags +faststart public/videos/finance_tracker-silent.mp4
ffmpeg -ss 18 -i public/videos/finance_tracker.mp4 -frames:v 1 -vf scale=1280:-2 -c:v libwebp -q:v 80 -compression_level 6 public/videos/finance_tracker-poster.webp
```

`ffprobe -show_format -show_streams` supplied the inventory measurements.
FFmpeg decoded the source and delivery video without errors. Their decoded
video-only SHA-256 hashes match:
`c148799545cec3b6cd90f09a8fd2f9c74a3bdede8afb8bc492ab153e58d2f0d6`.
Removing audio did not change the approved footage. No stock images,
website captures, or fabricated project previews were added.
