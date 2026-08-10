"""
Afrikaanse Meisie - WitKoffie | DaVinci Resolve Full Assembly
=============================================================
Assesses all clips, clears the timeline, then places every clip
gaplessly from start to finish, trimmed to exact durations synced
to the music structure. No holes, no gaps.

Usage:
  1. Open DaVinci Resolve with 'afrikaner meisie' project
  2. Workspace > Console > Py3 tab
  3. exec(open(r"path/to/davinci_setup.py").read())
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


# -- CONFIG -------------------------------------------------------------------

PROJECT_NAME = "afrikaner meisie"
TIMELINE_NAME = "Afrikaanse Meisie - Master"
MEDIA_DIR = r"G:\Music Releases\WitKoffie\WitKoffie Album\Afrikaanse Meisie - WitKoffie\Video\Raw"

FPS = 24
WIDTH = 1920
HEIGHT = 1080

# Hash ID -> scene name (matches original hf_*.mp4 filenames)
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
    "Scene 01-05 Stellenbosch": ["1_", "1.1_", "2_", "2.1_", "3_", "3.1_", "4_", "4.1_", "5_", "5.1_"],
    "Scene 06 DJ1": ["6_", "6.1_"],
    "Scene 07-08 NYC Berlin": ["7_", "7.1_", "8_", "8.1_"],
    "Scene 09 SP Paris": ["9_", "9.1_"],
    "Scene 10-12 Home Stars Dance": ["10_", "10.1_", "11_", "11.1_", "12_", "12.1_"],
    "Scene 13 DJ2": ["13_", "13.1_"],
    "Scene 14 Montage": ["14.1_", "14.2_", "14.3_", "14.4_"],
    "Scene 15-17 Return": ["15_", "15.1_", "16_", "16.1_", "17_", "17.1_"],
    "Scene 18 DJ Final": ["18_", "18.1_"],
    "Scene 19 Final": ["19_"],
}

# Timeline edit: (scene_name, target_duration_seconds, music_sync_note)
# Synced to actual WAV analysis timestamps. 41 clips, 283s total (4:43), zero gaps.
#
# Structure from WAV:
#   0:00-0:57  Instrumental intro (Stellenbosch landscapes)
#   0:57       First vocal entry -> face reveal
#   1:29       CHORUS "Afrikaanse meisie" -> DJ energy
#   1:44       English "I'm an Afrikaans girl" -> NYC
#   1:54       German "Ich bin ein Afrikaans Madchen" -> Berlin
#   2:01       CHORUS 2 "conquer the world" -> Sao Paulo/Paris
#   2:15       "She left the dirt road" -> farmhouse/homesick
#   2:45       Breakdown -> fire dance
#   3:01       City memories flash -> NYC/Berlin profiles
#   3:17       BIG multilingual reprise -> city montage + DJ peak
#   3:45       Absolute peak 47% -> golden return, stoep at peace
#   4:00       Fading/outro -> walking home
#   4:19       DJ winding down
#   4:33       Final orbit + smile -> fade to black
EDIT_LIST = [
    # --- INTRO 0:00-0:57 (57s) - Stellenbosch landscapes, building atmosphere ---
    ("1_jonkershoek_valley_back_to_camera",  10.0, "0:00 Intro - wide valley opens"),
    ("1.1_jonkershoek_low_left_angle",        6.0, "0:10 Low angle cut"),
    ("3_gravel_road_departure",               9.0, "0:16 Walking away, departure"),
    ("3.1_gravel_road_fence_angle",           6.0, "0:25 Through fence, rural SA"),
    ("4_oak_street_memory",                   9.0, "0:31 Oak street memory"),
    ("4.1_oak_street_behind",                 6.0, "0:40 Following her"),
    ("5_valley_declaration_orbit",           11.0, "0:46 Valley orbit, building to vocals"),
    # --- FIRST VOCALS 0:57-1:29 (32s) - Face reveal, energy grows ---
    ("2_mountain_face_reveal",                8.0, "0:57 FACE REVEAL at first vocal"),
    ("2.1_mountain_low_angle_up",             6.0, "1:05 Low angle power"),
    ("5.1_valley_behind_shoulder",            6.0, "1:11 Over shoulder, emotional"),
    ("6_dj_witkoffie_front_push",            12.0, "1:17 DJ enters, energy rises"),
    # --- CHORUS 1 1:29-1:44 (15s) - "Afrikaanse meisie" DJ peak ---
    ("6.1_dj_witkoffie_high_angle",           8.0, "1:29 CHORUS - DJ from above"),
    ("6_dj_witkoffie_front_push_ALT",         7.0, "1:37 DJ ALT take, peak chorus"),
    # --- NYC 1:44-1:54 (10s) - English lyric ---
    ("7_new_york_rain_walk",                 10.0, "1:44 I'm an Afrikaans girl - NYC"),
    # --- BERLIN 1:54-2:01 (7s) - German lyric ---
    ("8_berlin_underpass_tracking",           7.0, "1:54 Ich bin ein Afrikaans Madchen"),
    # --- CHORUS 2 2:01-2:15 (14s) - "conquer the world" ---
    ("9_sao_paulo_alive_spin",                7.0, "2:01 Conquer the world - SP alive"),
    ("9.1_paris_grace_bridge",                7.0, "2:08 Paris bridge grace"),
    # --- VERSE 3 2:15-2:45 (30s) - "She left the dirt road" ---
    ("10_farmhouse_stoep_homesick",           9.0, "2:15 She left the dirt road"),
    ("10.1_farmhouse_doorway_inside",         6.0, "2:24 Inside looking out, homesick"),
    ("11_starfield_arms_rising",              9.0, "2:30 Arms rising under stars"),
    ("11.1_starfield_birds_eye",              6.0, "2:39 Bird's eye starfield"),
    # --- BREAKDOWN 2:45-3:17 (32s) - fire dance + city memories + DJ build ---
    ("12_fire_dance_low_angle",               8.0, "2:45 BREAKDOWN - fire dance low"),
    ("12.1_fire_dance_orbit",                 8.0, "2:53 Fire orbit, primal energy"),
    ("7.1_new_york_right_profile",            5.0, "3:01 NYC memory flash"),
    ("8.1_berlin_high_wide",                  5.0, "3:06 Berlin memory flash"),
    ("13_dj_witkoffie_threequarter",          6.0, "3:11 DJ building to reprise"),
    # --- MULTILINGUAL REPRISE 3:17-3:45 (28s) - city montage + DJ peak ---
    ("14.1_nyc_looking_up",                   4.0, "3:17 REPRISE - NYC looking up"),
    ("14.2_berlin_glance_back",               4.0, "3:21 Berlin glance back"),
    ("14.3_sao_paulo_laughing",               4.0, "3:25 Sao Paulo laughing"),
    ("14.4_paris_bridge_turn",                4.0, "3:29 Paris bridge turn"),
    ("13.1_dj_witkoffie_over_shoulder",       5.0, "3:33 DJ peak over shoulder"),
    ("15_golden_return_approach",              7.0, "3:38 Golden return approach"),
    # --- ABSOLUTE PEAK 3:45-4:00 (15s) - golden profile + at peace ---
    ("15.1_golden_return_right_profile",       6.0, "3:45 PEAK 47% - golden profile"),
    ("16_stoep_at_peace_smile",               9.0, "3:51 At peace, smiling, home"),
    # --- FADING/OUTRO 4:00-4:33 (33s) - walking home, DJ final ---
    ("16.1_stoep_over_shoulder_valley",        6.0, "4:00 Over shoulder, valley"),
    ("17_walking_home_toward",                8.0, "4:06 Walking toward home"),
    ("17.1_walking_home_left_profile",         5.0, "4:14 Left profile"),
    ("18_dj_final_dolly_out",                  8.0, "4:19 DJ final dolly out"),
    ("18.1_dj_final_right_profile",            6.0, "4:27 DJ last look"),
    # --- FINAL 4:33-4:43 (10s) - orbit + smile -> black ---
    ("19_final_180_orbit",                     7.0, "4:33 Final 180 orbit"),
    ("19.1_final_smile_zoom",                  3.0, "4:40 Final smile -> fade to black"),
]

SYNC_MARKERS = [
    ("00:00:00:00", "Intro - atmosphere",          "Scene 1 valley opens"),
    ("00:00:57:00", "First vocals enter",          "Scene 2 FACE REVEAL"),
    ("00:01:17:00", "DJ enters",                   "Scene 6 DJ front push"),
    ("00:01:29:00", "CHORUS: Afrikaanse meisie",   "Scene 6.1 DJ high angle"),
    ("00:01:44:00", "English: Afrikaans girl",     "Scene 7 NYC rain walk"),
    ("00:01:54:00", "German: Afrikaans Madchen",   "Scene 8 Berlin underpass"),
    ("00:02:01:00", "CHORUS 2: conquer the world", "Scene 9 Sao Paulo"),
    ("00:02:15:00", "She left the dirt road",      "Scene 10 farmhouse"),
    ("00:02:45:00", "BREAKDOWN - fire dance",      "Scene 12 fire low angle"),
    ("00:03:01:00", "City memories flash",         "Scenes 7.1+8.1 profiles"),
    ("00:03:17:00", "MULTILINGUAL REPRISE",        "Scene 14 city montage"),
    ("00:03:38:00", "Golden return",               "Scene 15 approach"),
    ("00:03:45:00", "ABSOLUTE PEAK 47%",           "Scene 15.1+16 at peace"),
    ("00:04:00:00", "Fading/outro",                "Scene 16.1 valley view"),
    ("00:04:19:00", "DJ winding down",             "Scene 18 dolly out"),
    ("00:04:33:00", "Final - near silence",        "Scene 19 orbit+smile"),
    ("00:04:43:00", "Silence",                     "Fade to black"),
]


def tc_to_frames(tc, fps=FPS):
    parts = tc.split(":")
    h, m, s, f = int(parts[0]), int(parts[1]), int(parts[2]), int(parts[3])
    return ((h * 3600 + m * 60 + s) * fps) + f


def frames_to_tc(frames, fps=FPS):
    total_s = frames // fps
    f = frames % fps
    h = total_s // 3600
    m = (total_s % 3600) // 60
    s = total_s % 60
    return f"{h:02d}:{m:02d}:{s:02d}:{f:02d}"


def get_clip_props(clip):
    """Get clip duration and resolution from media pool item."""
    props = clip.GetClipProperty()
    duration = "?"
    res = "?"
    fps_val = FPS
    if props:
        duration = props.get("Duration", "?")
        res_w = props.get("Resolution", "?")
        res = res_w
        fps_str = props.get("FPS", "")
        if fps_str:
            try:
                fps_val = float(fps_str)
            except (ValueError, TypeError):
                pass
    frames = 0
    if props:
        start = props.get("Start", "0")
        end = props.get("End", "0")
        try:
            frames = int(end) - int(start)
        except (ValueError, TypeError):
            pass
    if frames <= 0 and props:
        dur_str = props.get("Frames", "0")
        try:
            frames = int(dur_str)
        except (ValueError, TypeError):
            pass
    seconds = frames / fps_val if fps_val > 0 and frames > 0 else 0
    return {
        "duration_str": duration,
        "resolution": res,
        "frames": frames,
        "seconds": round(seconds, 2),
        "fps": fps_val,
    }


def main():
    print("=" * 70)
    print("  AFRIKAANSE MEISIE - FULL TIMELINE ASSEMBLY")
    print("  Assess -> Clear -> Place gaplessly -> Sync to music")
    print("=" * 70)
    print()

    resolve = get_resolve()
    if not resolve:
        print("[ERROR] Cannot connect to DaVinci Resolve.")
        return

    pm = resolve.GetProjectManager()
    print("[OK] Connected to DaVinci Resolve")

    # -- Open project --------------------------------------------
    project = pm.GetCurrentProject()
    if project and project.GetName().lower() == PROJECT_NAME.lower():
        print(f"[OK] Project: {project.GetName()}")
    else:
        existing = pm.LoadProject(PROJECT_NAME)
        if existing:
            project = existing
            print(f"[OK] Opened: {PROJECT_NAME}")
        else:
            print(f"[ERROR] Could not open project '{PROJECT_NAME}'")
            return

    project.SetSetting("timelineResolutionWidth", str(WIDTH))
    project.SetSetting("timelineResolutionHeight", str(HEIGHT))
    project.SetSetting("timelineFrameRate", str(FPS))
    project.SetSetting("timelinePlaybackFrameRate", str(FPS))

    mp = project.GetMediaPool()
    root_folder = mp.GetRootFolder()

    # -- Ensure bins exist ---------------------------------------
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

    # -- Collect ALL clips from media pool -----------------------
    all_pool_clips = {}
    def collect_clips(folder):
        for clip in folder.GetClipList():
            all_pool_clips[clip.GetName()] = clip
        for sub in folder.GetSubFolderList():
            collect_clips(sub)
    collect_clips(root_folder)

    # -- Match clips by hash ID ----------------------------------
    scene_to_clip = {}
    scene_to_original = {}
    matched_names = set()
    for clip_name, clip in all_pool_clips.items():
        for hash_id, scene_name in HASH_TO_SCENE.items():
            if hash_id in clip_name:
                if scene_name not in scene_to_clip:
                    scene_to_clip[scene_name] = clip
                    scene_to_original[scene_name] = clip_name
                    matched_names.add(clip_name)
                break
        base = os.path.splitext(clip_name)[0]
        if base in HASH_TO_SCENE.values() and base not in scene_to_clip:
            scene_to_clip[base] = clip
            scene_to_original[base] = clip_name
            matched_names.add(clip_name)

    # -- Find audio ----------------------------------------------
    audio_clip = None
    for cname, clip in all_pool_clips.items():
        lower = cname.lower()
        if (".wav" in lower or lower.endswith(".wav")) and "afrikaan" in lower:
            audio_clip = clip
            break
    if not audio_clip:
        for cname, clip in all_pool_clips.items():
            if cname.lower().endswith(".wav"):
                audio_clip = clip
                break

    # ============================================================
    # PHASE 1: ASSESS ALL CLIPS
    # ============================================================
    print()
    print("=" * 70)
    print("  PHASE 1: CLIP ASSESSMENT")
    print("=" * 70)
    print()

    total_target = sum(dur for _, dur, _ in EDIT_LIST)
    print(f"  Song duration:  {int(total_target)}s ({int(total_target//60)}:{int(total_target%60):02d})")
    print(f"  Total clips:    {len(all_pool_clips)} in media pool")
    print(f"  Matched:        {len(scene_to_clip)} clips to scenes")
    print(f"  Edit list:      {len(EDIT_LIST)} clips to place")
    print(f"  Audio:          {'FOUND - ' + audio_clip.GetName() if audio_clip else 'NOT FOUND'}")
    print()

    print(f"  {'#':>3}  {'Scene Name':<42} {'Res':<12} {'Dur':>6} {'Target':>7} {'Status'}")
    print(f"  {'-'*3}  {'-'*42} {'-'*12} {'-'*6} {'-'*7} {'-'*10}")

    warnings = []
    running_tc = 0.0
    for i, (scene_name, target_dur, note) in enumerate(EDIT_LIST, 1):
        clip = scene_to_clip.get(scene_name)
        if clip:
            props = get_clip_props(clip)
            res = props["resolution"]
            actual_s = props["seconds"]
            dur_str = f"{actual_s:.1f}s" if actual_s > 0 else props["duration_str"]

            status = "OK"
            if actual_s > 0 and actual_s < target_dur:
                status = f"SHORT ({actual_s:.1f}<{target_dur:.1f})"
                warnings.append(f"  Clip {i} '{scene_name}': source {actual_s:.1f}s < target {target_dur:.1f}s")
            elif actual_s > 0:
                status = "OK"

            tc_str = f"{int(running_tc//60)}:{running_tc%60:05.2f}"
            print(f"  {i:3d}  {scene_name:<42} {res:<12} {dur_str:>6} {target_dur:>5.1f}s  {status}")
        else:
            print(f"  {i:3d}  {scene_name:<42} {'MISSING':<12} {'?':>6} {target_dur:>5.1f}s  NOT FOUND")
            warnings.append(f"  Clip {i} '{scene_name}': NOT FOUND in media pool")

        running_tc += target_dur

    print()
    if warnings:
        print("  WARNINGS:")
        for w in warnings:
            print(w)
        print()

    # -- Move clips to bins --------------------------------------
    if "Audio" in bin_refs and audio_clip:
        mp.MoveClips([audio_clip], bin_refs["Audio"])

    for bin_name, prefixes in BIN_SCENE_MAP.items():
        if bin_name not in bin_refs:
            continue
        clips_to_move = []
        for sname, clip in scene_to_clip.items():
            for prefix in prefixes:
                if sname.startswith(prefix):
                    clips_to_move.append(clip)
                    break
        if clips_to_move:
            mp.MoveClips(clips_to_move, bin_refs[bin_name])

    if "Old Redos" in bin_refs:
        unmatched = [c for n, c in all_pool_clips.items() if n not in matched_names and c != audio_clip]
        if unmatched:
            mp.MoveClips(unmatched, bin_refs["Old Redos"])
    print("[OK] Clips organized into bins")
    print()

    # ============================================================
    # PHASE 2: BUILD TIMELINE
    # ============================================================
    print("=" * 70)
    print("  PHASE 2: BUILDING GAPLESS TIMELINE")
    print("=" * 70)
    print()

    # -- Delete old timeline and create fresh --------------------
    mp.SetCurrentFolder(root_folder)
    timelines_to_delete = []
    for i in range(1, project.GetTimelineCount() + 1):
        tl = project.GetTimelineByIndex(i)
        if tl and tl.GetName() == TIMELINE_NAME:
            timelines_to_delete.append(tl)

    for tl in timelines_to_delete:
        mp.DeleteTimelines([tl])
        print(f"[OK] Deleted old timeline: {TIMELINE_NAME}")

    timeline = mp.CreateEmptyTimeline(TIMELINE_NAME)
    if not timeline:
        print("[ERROR] Could not create timeline")
        return
    project.SetCurrentTimeline(timeline)
    print(f"[OK] Created fresh timeline: {TIMELINE_NAME}")
    print()

    # -- Place audio FIRST on A1 (WAV = audio-only, no video) ---
    if audio_clip:
        result = mp.AppendToTimeline([{
            "mediaPoolItem": audio_clip,
            "trackIndex": 1,
            "mediaType": 2,
        }])
        if result:
            print(f"[OK] Audio on A1: {audio_clip.GetName()}")
        else:
            print("[WARN] Could not place audio -- drag Afrikaanse Meisie.wav to A1")
    else:
        print("[WARN] No WAV found -- import and drag to A1 manually")
    print()

    # -- Place video clips sequentially on V1 (video only) ------
    print("Placing clips gaplessly on V1 (video only, no embedded audio)...")
    print()
    placed = 0
    skipped = []
    running_time = 0.0

    for i, (scene_name, target_dur, note) in enumerate(EDIT_LIST, 1):
        pool_clip = scene_to_clip.get(scene_name)

        if not pool_clip:
            skipped.append((i, scene_name, target_dur))
            running_time += target_dur
            continue

        target_frames = int(round(target_dur * FPS))

        clip_info = {
            "mediaPoolItem": pool_clip,
            "trackIndex": 1,
            "mediaType": 1,
            "endFrame": target_frames,
        }

        result = mp.AppendToTimeline([clip_info])
        if result:
            placed += 1
            tc_min = int(running_time // 60)
            tc_sec = running_time % 60
            print(f"  [{placed:02d}] {tc_min}:{tc_sec:05.2f}  {scene_name}  ({target_dur}s)  {note}")
        else:
            skipped.append((i, scene_name, target_dur))

        running_time += target_dur

    print()
    print(f"[OK] Placed {placed}/{len(EDIT_LIST)} clips on V1")
    print(f"[OK] Total timeline: {int(running_time//60)}:{int(running_time%60):02d} (target: 4:43)")

    if skipped:
        print()
        print("[WARN] Skipped clips:")
        for idx, sname, dur in skipped:
            print(f"  #{idx} {sname} ({dur}s) -- not found in pool")

    # -- Clean up: delete any embedded audio that landed on A2+ --
    print()
    print("Cleaning up stray audio tracks...")
    for track_idx in range(2, 6):
        items = timeline.GetItemListInTrack("audio", track_idx)
        if items and len(items) > 0:
            timeline.DeleteClips(list(items))
            print(f"  [OK] Cleared {len(items)} stray audio clips from A{track_idx}")
    print()

    # -- Add sync markers ----------------------------------------
    marker_count = 0
    for tc, audio_event, visual_event in SYNC_MARKERS:
        frame = tc_to_frames(tc)
        result = timeline.AddMarker(frame, "Blue", audio_event, visual_event, 1)
        if result:
            marker_count += 1
    print(f"[OK] Added {marker_count} sync markers")
    print()

    # ============================================================
    # DONE
    # ============================================================
    print("=" * 70)
    print("  ASSEMBLY COMPLETE -- GAPLESS EDIT")
    print("=" * 70)
    print()
    print("  Timeline structure:")
    print("  A1: Afrikaanse Meisie.wav (full song)")
    print(f"  V1: {placed} clips, back-to-back, 0:00 to 4:43")
    print()
    print("  Next steps:")
    print("  1. LOCK A1 (click padlock on audio track)")
    print("  2. Right-click clips in pool -> Generate Optimized Media")
    print("  3. Play through -- slip clips L/R by frames to fine-tune sync")
    print("     Blue markers show where lyrics/beats should land")
    print("  4. Add 3s fade-to-black after last clip:")
    print("     Effects > Generators > Solid Color > Black (3s)")
    print("  5. Export: Deliver > MP4 H.264 1080p 24fps 20Mbps")
    print()


if __name__ == "__main__":
    main()
