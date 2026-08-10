# Afrikaanse Meisie - Clip Assessment
# Run in DaVinci Resolve Py3 console
# Scans all clips and reports: resolution, duration, FPS, scene match

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
            os.environ.get("PROGRAMDATA", r"C:\\ProgramData"),
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

# Scene descriptions for narrative context
SCENE_DESC = {
    "1_jonkershoek_valley_back_to_camera": "Stellenbosch valley, woman with back to camera, wide landscape",
    "1.1_jonkershoek_low_left_angle": "Stellenbosch valley, low angle from left side",
    "2_mountain_face_reveal": "Mountain setting, face reveal moment, first time seeing her",
    "2.1_mountain_low_angle_up": "Mountain, looking up at her from low angle",
    "3_gravel_road_departure": "Gravel/dirt road, walking away, departure feeling",
    "3.1_gravel_road_fence_angle": "Gravel road through fence, rural South Africa",
    "4_oak_street_memory": "Oak-lined street, nostalgic/memory feel, Stellenbosch",
    "4.1_oak_street_behind": "Oak street from behind, following her",
    "5_valley_declaration_orbit": "Valley wide shot, orbit around her, declaration moment",
    "5.1_valley_behind_shoulder": "Valley over-shoulder shot, looking out",
    "6_dj_witkoffie_front_push": "DJ WitKoffie performance, front push-in, energy",
    "6_dj_witkoffie_front_push_ALT": "DJ WitKoffie front push ALT take",
    "6.1_dj_witkoffie_high_angle": "DJ from above, high angle looking down at decks",
    "7_new_york_rain_walk": "New York City, walking in rain, urban international",
    "7.1_new_york_right_profile": "NYC, right profile shot",
    "8_berlin_underpass_tracking": "Berlin underpass/tunnel, tracking shot, European feel",
    "8.1_berlin_high_wide": "Berlin from above, wide establishing shot",
    "9_sao_paulo_alive_spin": "Sao Paulo, alive/spinning energy, Latin America",
    "9.1_paris_grace_bridge": "Paris bridge, graceful movement, Eiffel Tower context",
    "10_farmhouse_stoep_homesick": "SA farmhouse stoep/porch, homesick feeling, wistful",
    "10.1_farmhouse_doorway_inside": "Farmhouse doorway from inside, looking out at landscape",
    "11_starfield_arms_rising": "Under stars/night sky, arms rising up, spiritual",
    "11.1_starfield_birds_eye": "Starfield from above, bird's eye looking down",
    "12_fire_dance_low_angle": "Dancing near fire, low angle, primal energy",
    "12.1_fire_dance_orbit": "Fire dance with camera orbiting around, intense",
    "13_dj_witkoffie_threequarter": "DJ WitKoffie three-quarter angle, peak energy",
    "13.1_dj_witkoffie_over_shoulder": "DJ from over shoulder, seeing the crowd/decks",
    "14.1_nyc_looking_up": "NYC looking up at buildings, small in big city",
    "14.2_berlin_glance_back": "Berlin glancing back, fleeting memory",
    "14.3_sao_paulo_laughing": "Sao Paulo laughing, joy in the chaos",
    "14.4_paris_bridge_turn": "Paris bridge turning around, looking back",
    "15_golden_return_approach": "Golden hour, approaching home, return journey",
    "15.1_golden_return_right_profile": "Golden hour right profile, warm light",
    "16_stoep_at_peace_smile": "Back on stoep, at peace, smiling, acceptance",
    "16.1_stoep_over_shoulder_valley": "Stoep over shoulder looking at valley, home",
    "17_walking_home_toward": "Walking toward camera/home, coming back",
    "17.1_walking_home_left_profile": "Walking home, left profile",
    "18_dj_final_dolly_out": "DJ final set, camera dollying out, winding down",
    "18.1_dj_final_right_profile": "DJ final, right profile, last look",
    "19_final_180_orbit": "Final 180-degree orbit around her, full circle",
    "19.1_final_smile_zoom": "Final smile, camera zooms in, last image",
    "19.1_final_smile_zoom_ALT": "Final smile zoom ALT take",
}

def main():
    resolve = get_resolve()
    if not resolve:
        print("[ERROR] Cannot connect to DaVinci Resolve.")
        return

    pm = resolve.GetProjectManager()
    project = pm.GetCurrentProject()
    if not project:
        print("[ERROR] No project open")
        return

    print("=" * 80)
    print("  CLIP ASSESSMENT - Afrikaanse Meisie")
    print("  Project: " + project.GetName())
    print("=" * 80)
    print()

    mp = project.GetMediaPool()
    root_folder = mp.GetRootFolder()

    # Collect every clip from all bins
    all_clips = {}
    def collect(folder, path=""):
        folder_name = folder.GetName()
        current_path = path + "/" + folder_name if path else folder_name
        for clip in folder.GetClipList():
            all_clips[clip.GetName()] = {"clip": clip, "bin": current_path}
        for sub in folder.GetSubFolderList():
            collect(sub, current_path)
    collect(root_folder)

    # Match to scenes
    scene_data = []
    unmatched = []
    audio_clips = []

    for clip_name, info in all_clips.items():
        clip = info["clip"]
        bin_path = info["bin"]

        # Get properties
        props = clip.GetClipProperty()
        res = props.get("Resolution", "?") if props else "?"
        duration = props.get("Duration", "?") if props else "?"
        fps = props.get("FPS", "?") if props else "?"
        codec = props.get("Video Codec", "?") if props else "?"
        audio_ch = props.get("Audio Ch", "?") if props else "?"
        file_path = props.get("File Path", "?") if props else "?"

        frames = 0
        if props:
            try:
                s = int(props.get("Start", "0"))
                e = int(props.get("End", "0"))
                frames = e - s
            except (ValueError, TypeError):
                pass
            if frames <= 0:
                try:
                    frames = int(props.get("Frames", "0"))
                except (ValueError, TypeError):
                    pass

        try:
            fps_num = float(fps) if fps != "?" else 24.0
        except (ValueError, TypeError):
            fps_num = 24.0

        seconds = round(frames / fps_num, 2) if frames > 0 and fps_num > 0 else 0

        # Check if audio
        if clip_name.lower().endswith(".wav") or clip_name.lower().endswith(".mp3"):
            audio_clips.append({
                "name": clip_name,
                "duration": duration,
                "seconds": seconds,
                "bin": bin_path,
            })
            continue

        # Match by hash
        matched_scene = None
        for hash_id, scene_name in HASH_TO_SCENE.items():
            if hash_id in clip_name:
                matched_scene = scene_name
                break

        # Also check if already renamed
        base = os.path.splitext(clip_name)[0]
        if not matched_scene and base in HASH_TO_SCENE.values():
            matched_scene = base

        entry = {
            "name": clip_name,
            "scene": matched_scene,
            "description": SCENE_DESC.get(matched_scene, "Unknown scene"),
            "resolution": res,
            "duration_tc": duration,
            "seconds": seconds,
            "frames": frames,
            "fps": fps,
            "codec": codec,
            "audio": audio_ch,
            "bin": bin_path,
        }

        if matched_scene:
            scene_data.append(entry)
        else:
            unmatched.append(entry)

    # Sort matched clips by scene number
    def scene_sort_key(entry):
        s = entry["scene"]
        parts = s.split("_")[0]
        try:
            if "." in parts:
                main, sub = parts.split(".")
                return (int(main), int(sub))
            return (int(parts), 0)
        except ValueError:
            return (999, 0)

    scene_data.sort(key=scene_sort_key)

    # Print audio
    print("--- AUDIO ---")
    if audio_clips:
        for a in audio_clips:
            print(f"  {a['name']}")
            print(f"    Duration: {a['duration']}  ({a['seconds']}s)")
            print(f"    Bin: {a['bin']}")
    else:
        print("  No audio files found in media pool!")
    print()

    # Print each clip with full details
    print("--- VIDEO CLIPS (matched to scenes) ---")
    print()
    total_available = 0.0
    for i, entry in enumerate(scene_data, 1):
        total_available += entry["seconds"]
        print(f"  [{i:02d}] Scene: {entry['scene']}")
        print(f"       File: {entry['name']}")
        print(f"       What: {entry['description']}")
        print(f"       Res:  {entry['resolution']}   FPS: {entry['fps']}   Codec: {entry['codec']}")
        print(f"       Dur:  {entry['duration_tc']}  ({entry['seconds']}s / {entry['frames']} frames)")
        print(f"       Audio tracks: {entry['audio']}")
        print(f"       Bin:  {entry['bin']}")
        print()

    print(f"  TOTAL: {len(scene_data)} matched clips, {total_available:.1f}s of footage")
    print()

    # Print unmatched
    if unmatched:
        print("--- UNMATCHED CLIPS (old redos or unknown) ---")
        for entry in unmatched:
            print(f"  {entry['name']}")
            print(f"    Res: {entry['resolution']}  Dur: {entry['duration_tc']} ({entry['seconds']}s)")
        print()

    # Summary table for quick reference
    print("=" * 80)
    print("  QUICK REFERENCE - Copy this to share with Claude")
    print("=" * 80)
    print()
    print(f"  {'#':>3}  {'Scene':<42} {'Res':<14} {'Seconds':>8} {'FPS':>6}")
    print(f"  {'---':>3}  {'------------------------------------------':<42} {'----------':<14} {'-------':>8} {'-----':>6}")
    for i, entry in enumerate(scene_data, 1):
        print(f"  {i:3d}  {entry['scene']:<42} {entry['resolution']:<14} {entry['seconds']:>7.2f} {entry['fps']:>6}")
    print()
    print(f"  Total footage: {total_available:.1f}s across {len(scene_data)} clips")
    print(f"  Unmatched: {len(unmatched)} clips")
    print()
    print("  Now give Claude the WAV lyric/beat timestamps and")
    print("  this clip list to build the sync edit.")
    print()

if __name__ == "__main__":
    main()
