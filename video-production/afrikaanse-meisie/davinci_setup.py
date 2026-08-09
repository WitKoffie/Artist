"""
Afrikaanse Meisie - WitKoffie | DaVinci Resolve Project Setup
=============================================================
Automates: media import, bin organization, timeline creation,
clip placement (matched by hf_ hash ID), and audio placement.

Usage:
  1. Open DaVinci Resolve with 'afrikaner meisie' project open
  2. Open Console: Workspace > Console
  3. Click Py3 tab
  4. Run: exec(open(r"path/to/davinci_setup.py").read())

Requires DaVinci Resolve 18+ with scripting enabled.
"""

import sys
import os

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

FPS = 24
WIDTH = 1920
HEIGHT = 1080

# Hash ID -> scene name mapping (matches original hf_ filenames)
HASH_TO_SCENE = {
    "d8cf0db5": "1_jonkershoek_valley_back_to_camera",
    "85fcae59": "1.1_jonkershoek_low_left_angle",
    "c31a6073": "2_mountain_face_reveal",
    "31573078": "2.1_mountain_low_angle_up",
    "4a2173a7": "3_gravel_road_departure",
    "cfddf0b8": "3.1_gravel_road_fence_angle",
    "085b105f": "4_oak_street_memory",
    "e5b89b4d": "4.1_oak_street_behind",
    "7eb1c255": "5_valley_declaration_orbit",
    "ca84411e": "5.1_valley_behind_shoulder",
    "98c79de1": "6_dj_witkoffie_front_push",
    "b84dac61": "6_dj_witkoffie_front_push_ALT",
    "6bf49904": "6.1_dj_witkoffie_high_angle",
    "9c81a785": "7_new_york_rain_walk",
    "089af914": "7.1_new_york_right_profile",
    "f10c731d": "8_berlin_underpass_tracking",
    "061ba6bc": "8.1_berlin_high_wide",
    "0d8fda6c": "9_sao_paulo_alive_spin",
    "863503a1": "9.1_paris_grace_bridge",
    "ed9a2352": "10_farmhouse_stoep_homesick",
    "cc4cffc3": "10.1_farmhouse_doorway_inside",
    "605caf30": "11_starfield_arms_rising",
    "8f7a2fcf": "11.1_starfield_birds_eye",
    "022d1338": "12_fire_dance_low_angle",
    "d2c14be8": "12.1_fire_dance_orbit",
    "d1dd9e60": "13_dj_witkoffie_threequarter",
    "28e90d70": "13.1_dj_witkoffie_over_shoulder",
    "3ddfc16c": "14.1_nyc_looking_up",
    "6d8c333b": "14.2_berlin_glance_back",
    "a7960d24": "14.3_sao_paulo_laughing",
    "62620152": "14.4_paris_bridge_turn",
    "2d984ac1": "15_golden_return_approach",
    "59d0383c": "15.1_golden_return_right_profile",
    "7bedf5d8": "16_stoep_at_peace_smile",
    "f9c7c8f0": "16.1_stoep_over_shoulder_valley",
    "4acaa384": "17_walking_home_toward",
    "493af493": "17.1_walking_home_left_profile",
    "333935e6": "18_dj_final_dolly_out",
    "661f938a": "18.1_dj_final_right_profile",
    "ef9eb55f": "19_final_180_orbit",
    "fcc7c914": "19.1_final_smile_zoom",
    "c853f515": "19.1_final_smile_zoom_ALT",
}

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

BIN_SCENE_MAP = {
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

# (scene_name, timecode, duration_seconds, trim_to_seconds or None)
TIMELINE_ORDER = [
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
    parts = tc.split(":")
    h, m, s, f = int(parts[0]), int(parts[1]), int(parts[2]), int(parts[3])
    return ((h * 3600 + m * 60 + s) * fps) + f


def seconds_to_frames(sec, fps=FPS):
    return int(round(sec * fps))


def find_clip_by_hash(clip_name, scene_to_clip):
    """Find a media pool clip by its scene name, using the hash lookup."""
    return scene_to_clip.get(clip_name)


def main():
    print("=" * 60)
    print("  AFRIKAANSE MEISIE - DAVINCI RESOLVE SETUP")
    print("=" * 60)

    resolve = get_resolve()
    if not resolve:
        print("[ERROR] Cannot connect to DaVinci Resolve.")
        print("  Preferences > System > General > External scripting using: Local")
        return

    pm = resolve.GetProjectManager()
    print("[OK] Connected to DaVinci Resolve")

    # ── Open project ────────────────────────────────────────────
    project = pm.GetCurrentProject()
    if project and project.GetName().lower() == PROJECT_NAME.lower():
        print(f"[OK] Using currently open project: {project.GetName()}")
    else:
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
        else:
            mp.SetCurrentFolder(root_folder)
            new_bin = mp.AddSubFolder(root_folder, bin_name)
            if new_bin:
                bin_refs[bin_name] = new_bin
    print(f"[OK] Bins ready ({len(bin_refs)}/{len(BINS)})")

    # ── Collect all clips from media pool ───────────────────────
    all_pool_clips = {}
    def collect_clips(folder):
        for clip in folder.GetClipList():
            all_pool_clips[clip.GetName()] = clip
        for sub in folder.GetSubFolderList():
            collect_clips(sub)
    collect_clips(root_folder)
    print(f"[OK] Found {len(all_pool_clips)} clips in media pool")

    # ── Build scene_name -> clip lookup using hash matching ─────
    scene_to_clip = {}
    matched_clips = set()
    for clip_name, clip in all_pool_clips.items():
        for hash_id, scene_name in HASH_TO_SCENE.items():
            if hash_id in clip_name:
                if scene_name not in scene_to_clip:
                    scene_to_clip[scene_name] = clip
                    matched_clips.add(clip_name)
                    break
        # Also check if clip is already renamed
        base = os.path.splitext(clip_name)[0]
        if base in HASH_TO_SCENE.values() and base not in scene_to_clip:
            scene_to_clip[base] = clip
            matched_clips.add(clip_name)

    print(f"[OK] Matched {len(scene_to_clip)} clips by hash ID")

    # ── Find audio clip ─────────────────────────────────────────
    audio_clip = None
    for cname, clip in all_pool_clips.items():
        lower = cname.lower()
        if "afrikaan" in lower and (".wav" in lower or lower.endswith("meisie")):
            audio_clip = clip
            break
    if not audio_clip:
        for cname, clip in all_pool_clips.items():
            if cname.lower().endswith(".wav"):
                audio_clip = clip
                break

    # ── Move clips to bins ──────────────────────────────────────
    if "Audio" in bin_refs and audio_clip:
        mp.MoveClips([audio_clip], bin_refs["Audio"])
        print(f"[OK] Moved audio -> Audio bin")

    for bin_name, scene_names in BIN_SCENE_MAP.items():
        if bin_name not in bin_refs:
            continue
        clips_to_move = []
        for sname in scene_names:
            if sname in scene_to_clip:
                clips_to_move.append(scene_to_clip[sname])
        if clips_to_move:
            mp.MoveClips(clips_to_move, bin_refs[bin_name])
    print("[OK] Organized clips into scene bins")

    # Unmatched clips go to Old Redos
    if "Old Redos" in bin_refs:
        unmatched = []
        for cname, clip in all_pool_clips.items():
            if cname not in matched_clips and clip != audio_clip:
                unmatched.append(clip)
        if unmatched:
            mp.MoveClips(unmatched, bin_refs["Old Redos"])
            print(f"[OK] Moved {len(unmatched)} unmatched clips -> Old Redos")
    print()

    # ── Create or clear timeline ────────────────────────────────
    mp.SetCurrentFolder(root_folder)
    timeline = None
    for i in range(1, project.GetTimelineCount() + 1):
        tl = project.GetTimelineByIndex(i)
        if tl and tl.GetName() == TIMELINE_NAME:
            timeline = tl
            break

    if timeline:
        project.SetCurrentTimeline(timeline)
        track = timeline.GetItemListInTrack("video", 1)
        if track and len(track) > 0:
            print(f"[INFO] Timeline has {len(track)} existing video clips — clearing V1")
            for item in reversed(track):
                timeline.DeleteClips([item])
        audio_track = timeline.GetItemListInTrack("audio", 1)
        if audio_track and len(audio_track) > 0:
            print(f"[INFO] Clearing {len(audio_track)} existing audio clips on A1")
            for item in reversed(audio_track):
                timeline.DeleteClips([item])
        print(f"[OK] Using timeline: {TIMELINE_NAME} (cleared)")
    else:
        timeline = mp.CreateEmptyTimeline(TIMELINE_NAME)
        if timeline:
            project.SetCurrentTimeline(timeline)
            print(f"[OK] Created timeline: {TIMELINE_NAME}")
        else:
            print("[ERROR] Could not create timeline")
            return
    print()

    # ── Place audio on A1 ───────────────────────────────────────
    if audio_clip:
        mp.AppendToTimeline([{
            "mediaPoolItem": audio_clip,
            "trackIndex": 1,
            "mediaType": 2,
        }])
        print(f"[OK] Placed audio on A1: {audio_clip.GetName()}")
        print("     -> LOCK A1 manually (click padlock)")
    else:
        print("[WARN] No WAV found in media pool")
        print("  Import Afrikaanse Meisie.wav manually and drag to A1")
    print()

    # ── Place video clips on V1 in order ────────────────────────
    print("Placing clips on V1...")
    placed = 0
    skipped = []

    for scene_name, timecode, dur, trim_to in TIMELINE_ORDER:
        pool_clip = scene_to_clip.get(scene_name)

        if not pool_clip:
            skipped.append(scene_name)
            continue

        clip_info = {
            "mediaPoolItem": pool_clip,
            "trackIndex": 1,
            "mediaType": 1,
        }

        if trim_to is not None:
            clip_info["endFrame"] = seconds_to_frames(trim_to)

        result = mp.AppendToTimeline([clip_info])
        if result:
            placed += 1
            trim_note = f" (trim {trim_to}s)" if trim_to else ""
            print(f"  [{placed:02d}] {scene_name}{trim_note}")

    print(f"\n[OK] Placed {placed}/{len(TIMELINE_ORDER)} clips on V1")
    if skipped:
        print(f"[WARN] Skipped (not in pool):")
        for s in skipped:
            print(f"  - {s}")
    print()

    # ── Add sync markers ────────────────────────────────────────
    for tc, audio_event, visual_event in SYNC_MARKERS:
        frame = tc_to_frames(tc)
        timeline.AddMarker(frame, "Blue", audio_event, visual_event, 1)
    print(f"[OK] Added {len(SYNC_MARKERS)} sync markers")
    print()

    # ── Summary ─────────────────────────────────────────────────
    print("=" * 60)
    print("  DONE!")
    print("=" * 60)
    print()
    print("  Next steps:")
    print("  1. Lock A1 (click padlock icon)")
    print("  2. Right-click clips -> Generate Optimized Media (fixes VFR)")
    print("  3. Play through and slip clips to sync with audio")
    print("  4. Add 3s black after last clip (Generators -> Solid Color)")
    print("  5. Export: Deliver page, MP4 H.264, 1080p 24fps, 20Mbps")
    print()


if __name__ == "__main__":
    main()
