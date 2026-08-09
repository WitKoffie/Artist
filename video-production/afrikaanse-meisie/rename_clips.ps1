# Afrikaanse Meisie - WitKoffie | Clip Rename Script
# Run in: G:\Music Releases\WitKoffie\WitKoffie Album\Afrikaanse Meisie - WitKoffie\Video\Raw
# Right-click -> Run with PowerShell

$map = @{
    "d8cf0db5" = "1_jonkershoek_valley_back_to_camera"
    "85fcae59" = "1.1_jonkershoek_low_left_angle"
    "c31a6073" = "2_mountain_face_reveal"
    "31573078" = "2.1_mountain_low_angle_up"
    "4a2173a7" = "3_gravel_road_departure"
    "cfddf0b8" = "3.1_gravel_road_fence_angle"
    "085b105f" = "4_oak_street_memory"
    "e5b89b4d" = "4.1_oak_street_behind"
    "7eb1c255" = "5_valley_declaration_orbit"
    "ca84411e" = "5.1_valley_behind_shoulder"
    "98c79de1" = "6_dj_witkoffie_front_push"
    "b84dac61" = "6_dj_witkoffie_front_push_ALT"
    "6bf49904" = "6.1_dj_witkoffie_high_angle"
    "9c81a785" = "7_new_york_rain_walk"
    "089af914" = "7.1_new_york_right_profile"
    "f10c731d" = "8_berlin_underpass_tracking"
    "061ba6bc" = "8.1_berlin_high_wide"
    "0d8fda6c" = "9_sao_paulo_alive_spin"
    "863503a1" = "9.1_paris_grace_bridge"
    "ed9a2352" = "10_farmhouse_stoep_homesick"
    "cc4cffc3" = "10.1_farmhouse_doorway_inside"
    "605caf30" = "11_starfield_arms_rising"
    "8f7a2fcf" = "11.1_starfield_birds_eye"
    "022d1338" = "12_fire_dance_low_angle"
    "d2c14be8" = "12.1_fire_dance_orbit"
    "d1dd9e60" = "13_dj_witkoffie_threequarter"
    "28e90d70" = "13.1_dj_witkoffie_over_shoulder"
    "3ddfc16c" = "14.1_nyc_looking_up"
    "6d8c333b" = "14.2_berlin_glance_back"
    "a7960d24" = "14.3_sao_paulo_laughing"
    "62620152" = "14.4_paris_bridge_turn"
    "2d984ac1" = "15_golden_return_approach"
    "59d0383c" = "15.1_golden_return_right_profile"
    "7bedf5d8" = "16_stoep_at_peace_smile"
    "f9c7c8f0" = "16.1_stoep_over_shoulder_valley"
    "4acaa384" = "17_walking_home_toward"
    "493af493" = "17.1_walking_home_left_profile"
    "333935e6" = "18_dj_final_dolly_out"
    "661f938a" = "18.1_dj_final_right_profile"
    "ef9eb55f" = "19_final_180_orbit"
    "fcc7c914" = "19.1_final_smile_zoom"
    "c853f515" = "19.1_final_smile_zoom_ALT"
}

$files = Get-ChildItem -Filter "hf_*.mp4"
$renamed = 0
$unmatched = @()

foreach ($file in $files) {
    $matched = $false
    foreach ($key in $map.Keys) {
        if ($file.Name -match $key) {
            $newName = $map[$key] + ".mp4"
            if (Test-Path $newName) {
                $newName = $map[$key] + "_v2.mp4"
            }
            Rename-Item $file.FullName -NewName $newName
            Write-Host "RENAMED: $($file.Name) -> $newName" -ForegroundColor Green
            $matched = $true
            $renamed++
            break
        }
    }
    if (-not $matched) {
        $unmatched += $file.Name
    }
}

Write-Host "`n--- SUMMARY ---" -ForegroundColor Cyan
Write-Host "Renamed: $renamed files" -ForegroundColor Green
if ($unmatched.Count -gt 0) {
    Write-Host "`nUnmatched (old redos - can delete):" -ForegroundColor Yellow
    $unmatched | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
}
Write-Host "`nDone. Now run the DaVinci Resolve script." -ForegroundColor Cyan
