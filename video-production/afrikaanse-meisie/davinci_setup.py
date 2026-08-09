"""
Afrikaanse Meisie - WitKoffie | DaVinci Resolve Project Setup
=============================================================
Automates: project creation, media import, bin organization,
timeline creation, clip placement, and export settings.

Usage:
  1. Run rename_clips.ps1 first to rename raw clips
  2. Open DaVinci Resolve
  3. Open Console: Workspace > Console
  4. Run: exec(open(r"path/to/davinci_setup.py").read())
     Or run from system Python with DaVinciResolveScript on PATH

Requires DaVinci Resolve 18+ with scripting enabled.
"""

import sys
import os
import time

def get_resolve():
    try:
        import DaVinciResolveScript as dvr
        return dvr.scriptapp("Resolve")
    except ImportError:
        pass
    if sys.platform == "win32":
        script_dir = os.path.join(
            os.environ.get("PROGRAMDATA", r"C:\ProgramData"),
            "Blackmagic Design", "DaVinci Resolve", "Support", "Developer",
            "Scripting", "Modules"
        )
    elif sys.platform == "darwin":
        script_dir = "/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules"
    else:
        script_dir = "/opt/resolve/Developer/Scripting/Modules"
    if script_dir not in sys.path:
        sys.path.append(script_dir)
    import DaVinciResolveScript as dvr
    return dvr.scriptapp("Resolve")


# ── CONFIG ──────────────────────────────────────────────────────────────────

PROJECT_NAME = "afrikaner meisie"
TIMELINE_NAME = "Afrikaanse Meisie - Master"

MEDIA_DIR = r"G:\Music Releases\WitKoffie\WitKoffie Album\Afrikaanse Meisie - WitKoffie\Video\Raw"
AUDIO_FILE = "Afrikaanse Meisie.wav"

FPS = 24
WIDTH = 1920
HEIGHT = 1080

BINS = [
    "Audio",
    "Scene 01-05 Stellenbosch",
    "Scene 06 DJ1",
    "Scene 07-08 NYC Berlin",
    "Scene 09 SP Paris",
    "Scene 10-12 Home Stars Dance",
    "Scene 13 DJ2",
    "Scene 14 Montage",
    "Scene 15-17 Return",
    "Scene 18 DJ Final",
    "Scene 19 Final",
    "Old Redos",
]

BIN_ASSIGNMENTS = {
    "Scene 01-05 Stellenbosch": [
        "1_jonkershoek_valley_back_to_camera",
        "1.1_jonkershoek_low_left_angle",
        "2_mountain_face_reveal",
        "2.1_mountain_low_angle_up",
        "3_gravel_road_departure",
        "3.1_gravel_road_fence_angle",
        "4_oak_street_memory",
        "4.1_oak_street_behind",
        "5_valley_declaration_orbit",
        "5.1_valley_behind_shoulder",
    ],
    "Scene 06 DJ1": [
        "6_dj_witkoffie_front_push",
        "6_dj_witkoffie_front_push_ALT",
        "6.1_dj_witkoffie_high_angle",
    ],
    "Scene 07-08 NYC Berlin": [
        "7_new_york_rain_walk",
        "7.1_new_york_right_profile",
        "8_berlin_underpass_tracking",
        "8.1_berlin_high_wide",
    ],
    "Scene 09 SP Paris": [
        "9_sao_paulo_alive_spin",
        "9.1_paris_grace_bridge",
    ],
    "Scene 10-12 Home Stars Dance": [
        "10_farmhouse_stoep_homesick",
        "10.1_farmhouse_doorway_inside",
        "11_starfield_arms_rising",
        "11.1_starfield_birds_eye",
        "12_fire_dance_low_angle",
        "12.1_fire_dance_orbit",
    ],
    "Scene 13 DJ2": [
        "13_dj_witkoffie_threequarter",
        "13.1_dj_witkoffie_over_shoulder",
    ],
    "Scene 14 Montage": [
        "14.1_nyc_looking_up",
        "14.2_berlin_glance_back",
        "14.3_sao_paulo_laughing",
        "14.4_paris_bridge_turn",
    ],
    "Scene 15-17 Return": [
        "15_golden_return_approach",
        "15.1_golden_return_right_profile",
        "16_stoep_at_peace_smile",
        "16.1_stoep_over_shoulder_valley",
        "17_walking_home_toward",
        "17.1_walking_home_left_profile",
    ],
    "Scene 18 DJ Final": [
        "18_dj_final_dolly_out",
        "18.1_dj_final_right_profile",
    ],
    "Scene 19 Final": [
        "19_final_180_orbit",
        "19.1_final_smile_zoom",
        "19.1_final_smile_zoom_ALT",
    ],
}

# (clip_name, timecode "HH:MM:SS:FF", duration_seconds, trim_to_seconds or None)
TIMELINE_CLIPS = [
    ("1_jonkershoek_valley_back_to_camera",  "00:00:00:00", 10, None),
    ("1.1_jonkershoek_low_left_angle",       "00:00:10:00",  5, None),
    ("2_mountain_face_reveal",               "00:00:15:00", 10, None),
    ("2.1_mountain_low_angle_up",            "00:00:25:00",  5, None),
    ("3_gravel_road_departure",              "00:00:30:00", 10, None),
    ("3.1_gravel_road_fence_angle",          "00:00:40:00",  5, None),
    ("4_oak_street_memory",                  "00:00:45:00", 10, None),
    ("4.1_oak_street_behind",                "00:00:55:00",  5, None),
    ("5_valley_declaration_orbit",           "00:01:00:00", 10, None),
    ("5.1_valley_behind_shoulder",           "00:01:10:00",  5, None),
    ("6_dj_witkoffie_front_push",            "00:01:15:00", 10, None),
    ("6.1_dj_witkoffie_high_angle",          "00:01:25:00",  5, None),
    ("7_new_york_rain_walk",                 "00:01:30:00", 10, None),
    ("7.1_new_york_right_profile",           "00:01:40:00",  5, None),
    ("8_berlin_underpass_tracking",          "00:01:45:00", 10, None),
    ("8.1_berlin_high_wide",                 "00:01:55:00",  5, None),
    ("9_sao_paulo_alive_spin",               "00:02:00:00", 10, 7),
    ("9.1_paris_grace_bridge",               "00:02:07:00", 10, 8),
    ("10_farmhouse_stoep_homesick",          "00:02:15:00", 10, None),
    ("10.1_farmhouse_doorway_inside",        "00:02:25:00",  5, None),
    ("11_starfield_arms_rising",             "00:02:30:00", 10, None),
    ("11.1_starfield_birds_eye",             "00:02:40:00",  5, None),
    ("12_fire_dance_low_angle",              "00:02:45:00",  5, None),
    ("12.1_fire_dance_orbit",                "00:02:50:00", 10, None),
    ("13_dj_witkoffie_threequarter",         "00:03:00:00", 10, None),
    ("13.1_dj_witkoffie_over_shoulder",      "00:03:10:00",  5, None),
    ("14.1_nyc_looking_up",                  "00:03:15:00",  5, 3.5),
    ("14.2_berlin_glance_back",              "00:03:18:12",  5, 3.5),
    ("14.3_sao_paulo_laughing",              "00:03:22:00",  5, 3.5),
    ("14.4_paris_bridge_turn",               "00:03:25:12",  5, 3.5),
    ("15_golden_return_approach",            "00:03:30:00", 10, None),
    ("15.1_golden_return_right_profile",     "00:03:40:00",  5, None),
    ("16_stoep_at_peace_smile",              "00:03:45:00", 10, None),
    ("16.1_stoep_over_shoulder_valley",      "00:03:55:00",  5, None),
    ("17_walking_home_toward",               "00:04:00:00", 10, None),
    ("17.1_walking_home_left_profile",       "00:04:10:00",  5, None),
    ("18_dj_final_dolly_out",                "00:04:15:00", 10, None),
    ("18.1_dj_final_right_profile",          "00:04:25:00",  5, None),
    ("19_final_180_orbit",                   "00:04:30:00", 10, None),
    ("19.1_final_smile_zoom",                "00:04:40:00",  5, 3),
]

# Audio sync markers: (timecode, audio_event, visual_event)
SYNC_MARKERS = [
    ("00:00:00:00", "First pad/atmosphere",             "Scene 1 opens"),
    ("00:00:15:00", "Kick enters",                      "Scene 2 face reveal"),
    ("00:00:30:00", "Groove locks",                     "Scene 3 she walks"),
    ("00:00:45:00", "Sy's gebore in Stellenbosch",      "Scene 4 oak street"),
    ("00:01:00:00", "Afrikaanse meisie chorus",         "Scene 5 declaration"),
    ("00:01:15:00", "Elke stad ken haar gesig",         "Scene 6 DJ enters"),
    ("00:01:30:00", "English lyric NYC",                "Scene 7 Times Square"),
    ("00:01:45:00", "German lyric Berlin",              "Scene 8 underpass"),
    ("00:02:00:00", "Jy gaan die wereld verower",       "Scene 9 SP+Paris"),
    ("00:02:15:00", "Sy't die stofpad verlaat",         "Scene 10 homesick"),
    ("00:02:30:00", "Jy hoef nie bly nie",              "Scene 11 starfield"),
    ("00:02:45:00", "Sy dans met vuur",                 "Scene 12 DANCE"),
    ("00:03:00:00", "Multilingual reprise",             "Scene 13 DJ peak"),
    ("00:03:15:00", "Cities fading",                    "Scene 14 montage"),
    ("00:03:30:00", "Instrumental peak",                "Scene 15 golden return"),
    ("00:03:45:00", "Elements strip",                   "Scene 16 at peace"),
    ("00:04:00:00", "Outro fading",                     "Scene 17 walking home"),
    ("00:04:15:00", "Minimal",                          "Scene 18 DJ final"),
    ("00:04:30:00", "Near silence",                     "Scene 19 orbit+smile"),
    ("00:04:43:00", "Silence",                          "Fade to black"),
]


def tc_to_frames(tc, fps=FPS):
    """Convert 'HH:MM:SS:FF' to frame count."""
    parts = tc.split(":")
    h, m, s, f = int(parts[0]), int(parts[1]), int(parts[2]), int(parts[3])
    return ((h * 3600 + m * 60 + s) * fps) + f


def seconds_to_frames(sec, fps=FPS):
    """Convert seconds to frame count."""
    return int(round(sec * fps))


def main():
    print("=" * 60)
    print("  AFRIKAANSE MEISIE - DAVINCI RESOLVE SETUP")
    print("=" * 60)

    # ── Connect to Resolve ──────────────────────────────────────
    resolve = get_resolve()
    if not resolve:
        print("[ERROR] Cannot connect to DaVinci Resolve.")
        print("  Make sure Resolve is open and scripting is enabled:")
        print("  Preferences > System > General > External scripting using: Local")
        return

    pm = resolve.GetProjectManager()
    print("[OK] Connected to DaVinci Resolve")

    # ── Create project ──────────────────────────────────────────
    existing = pm.LoadProject(PROJECT_NAME)
    if existing:
        project = existing
        print(f"[OK] Opened existing project: {PROJECT_NAME}")
    else:
        project = pm.CreateProject(PROJECT_NAME)
        if not project:
            print(f"[ERROR] Could not create project '{PROJECT_NAME}'")
            return
        print(f"[OK] Created project: {PROJECT_NAME}")

    # ── Project settings ────────────────────────────────────────
    project.SetSetting("timelineResolutionWidth", str(WIDTH))
    project.SetSetting("timelineResolutionHeight", str(HEIGHT))
    project.SetSetting("timelineFrameRate", str(FPS))
    project.SetSetting("timelinePlaybackFrameRate", str(FPS))
    print(f"[OK] Project settings: {WIDTH}x{HEIGHT} @ {FPS}fps")

    mp = project.GetMediaPool()
    root_folder = mp.GetRootFolder()

    # ── Create bins ─────────────────────────────────────────────
    existing_bins = {f.GetName(): f for f in root_folder.GetSubFolderList()}
    bin_refs = {}
    for bin_name in BINS:
        if bin_name in existing_bins:
            bin_refs[bin_name] = existing_bins[bin_name]
            print(f"[OK] Bin exists: {bin_name}")
        else:
            mp.SetCurrentFolder(root_folder)
            new_bin = mp.AddSubFolder(root_folder, bin_name)
            if new_bin:
                bin_refs[bin_name] = new_bin
                print(f"[OK] Created bin: {bin_name}")
            else:
                print(f"[WARN] Could not create bin: {bin_name}")
    print()

    # ── Import media ────────────────────────────────────────────
    if not os.path.isdir(MEDIA_DIR):
        print(f"[WARN] Media directory not found: {MEDIA_DIR}")
        print("  Update MEDIA_DIR in this script to your actual path.")
        print("  Skipping import — you can import manually.")
    else:
        mp.SetCurrentFolder(root_folder)
        media_files = []
        for f in os.listdir(MEDIA_DIR):
            fpath = os.path.join(MEDIA_DIR, f)
            if os.path.isfile(fpath) and (f.endswith(".mp4") or f.endswith(".wav")):
                media_files.append(fpath)

        if media_files:
            imported = mp.ImportMedia(media_files)
            if imported:
                print(f"[OK] Imported {len(imported)} media files")
            else:
                print("[WARN] Import returned no clips — files may already be in pool")
        else:
            print("[WARN] No .mp4/.wav files found in media directory")

        # Move clips to bins
        all_clips = root_folder.GetClipList()
        clip_map = {}
        for clip in all_clips:
            name = clip.GetName()
            clip_map[name] = clip

        # Move audio
        audio_key = AUDIO_FILE.replace(".wav", "")
        if "Audio" in bin_refs:
            for cname, clip in clip_map.items():
                if "Afrikaanse Meisie" in cname and cname.endswith((".wav", "")):
                    mp.MoveClips([clip], bin_refs["Audio"])
                    print(f"[OK] Moved '{cname}' -> Audio bin")
                    break

        # Move video clips to scene bins
        for bin_name, clip_names in BIN_ASSIGNMENTS.items():
            if bin_name not in bin_refs:
                continue
            for cname in clip_names:
                mp4_name = cname + ".mp4"
                if cname in clip_map:
                    mp.MoveClips([clip_map[cname]], bin_refs[bin_name])
                elif mp4_name in clip_map:
                    mp.MoveClips([clip_map[mp4_name]], bin_refs[bin_name])
        print("[OK] Organized clips into bins")
    print()

    # ── Create timeline ─────────────────────────────────────────
    mp.SetCurrentFolder(root_folder)
    timeline = None
    for i in range(1, project.GetTimelineCount() + 1):
        tl = project.GetTimelineByIndex(i)
        if tl and tl.GetName() == TIMELINE_NAME:
            timeline = tl
            break

    if timeline:
        project.SetCurrentTimeline(timeline)
        print(f"[OK] Using existing timeline: {TIMELINE_NAME}")
    else:
        timeline = mp.CreateEmptyTimeline(TIMELINE_NAME)
        if timeline:
            project.SetCurrentTimeline(timeline)
            print(f"[OK] Created timeline: {TIMELINE_NAME}")
        else:
            print("[ERROR] Could not create timeline")
            return
    print()

    # ── Build clip lookup from all bins ──────────────────────────
    all_pool_clips = {}
    def collect_clips(folder):
        for clip in folder.GetClipList():
            all_pool_clips[clip.GetName()] = clip
        for sub in folder.GetSubFolderList():
            collect_clips(sub)
    collect_clips(root_folder)

    # ── Place audio on A1 ───────────────────────────────────────
    audio_clip = None
    for cname, clip in all_pool_clips.items():
        if "Afrikaanse Meisie" in cname:
            audio_clip = clip
            break

    if audio_clip:
        mp.AppendToTimeline([{
            "mediaPoolItem": audio_clip,
            "trackIndex": 1,
            "mediaType": 2,  # audio only
        }])
        print(f"[OK] Placed audio on A1: {audio_clip.GetName()}")
        print("     -> LOCK A1 manually (click padlock) to protect audio")
    else:
        print("[WARN] Audio file not found in pool — import manually")
    print()

    # ── Place video clips on V1 ─────────────────────────────────
    placed = 0
    skipped = []
    for clip_name, timecode, dur, trim_to in TIMELINE_CLIPS:
        pool_clip = None
        for cname, clip in all_pool_clips.items():
            base = os.path.splitext(cname)[0]
            if base == clip_name:
                pool_clip = clip
                break

        if not pool_clip:
            skipped.append(clip_name)
            continue

        frame_pos = tc_to_frames(timecode)
        clip_info = {
            "mediaPoolItem": pool_clip,
            "trackIndex": 1,
            "mediaType": 1,  # video only
            "recordFrame": frame_pos,
        }

        if trim_to is not None:
            clip_info["endFrame"] = seconds_to_frames(trim_to)

        result = mp.AppendToTimeline([clip_info])
        if result:
            placed += 1
            trim_note = f" (trimmed to {trim_to}s)" if trim_to else ""
            print(f"  [{placed:02d}] {clip_name} @ {timecode}{trim_note}")

    print(f"\n[OK] Placed {placed}/{len(TIMELINE_CLIPS)} clips on V1")
    if skipped:
        print(f"[WARN] Skipped (not found in pool): {', '.join(skipped)}")
    print()

    # ── Add sync markers ────────────────────────────────────────
    for tc, audio_event, visual_event in SYNC_MARKERS:
        frame = tc_to_frames(tc)
        marker_text = f"{audio_event} | {visual_event}"
        timeline.AddMarker(frame, "Blue", audio_event, visual_event, 1)

    print(f"[OK] Added {len(SYNC_MARKERS)} sync markers to timeline")
    print("     Use these as guides when fine-tuning clip sync to audio")
    print()

    # ── Export preset info ──────────────────────────────────────
    print("=" * 60)
    print("  EXPORT SETTINGS (apply manually in Deliver page)")
    print("=" * 60)
    print(f"  Format:     MP4 (H.264)")
    print(f"  Resolution: {WIDTH}x{HEIGHT}")
    print(f"  Frame rate: {FPS} fps progressive")
    print(f"  Bitrate:    20,000 Kbps (or Best quality)")
    print(f"  Audio:      AAC, 48kHz, Stereo")
    print(f"  Filename:   Afrikaanse Meisie - WitKoffie (Official Music Video)")
    print(f"  Save to:    G:\\Music Releases\\WitKoffie\\WitKoffie Album\\")
    print(f"              Afrikaanse Meisie - WitKoffie\\Video\\Final")
    print()

    # ── Done ────────────────────────────────────────────────────
    print("=" * 60)
    print("  SETUP COMPLETE")
    print("=" * 60)
    print()
    print("  Next steps:")
    print("  1. Lock A1 (audio track) — click the padlock icon")
    print("  2. Right-click clips in Media Pool -> Generate Optimized Media")
    print("     (fixes variable frame rate jerkiness)")
    print("  3. Play through timeline and slip clips to sync with audio")
    print("     Use the blue markers as sync guides")
    print("  4. Add 3s fade to black after the last clip")
    print("     Effects Library -> Generators -> Solid Color -> Black")
    print("  5. Export from Deliver page with settings above")
    print()


if __name__ == "__main__":
    main()
