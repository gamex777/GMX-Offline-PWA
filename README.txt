CSD Offline PWA — Build 15.3

Galaxy A16 Mario Kart 64 turbo repair
- Replaces the heavier Mupen test from Build 15.2 with EmulatorJS's smaller Parallel N64 browser core.
- Forces the modern WebGL2 package; Build 15.1 had accidentally selected the legacy WebGL1 package.
- Forces the browser-compiled Glide64 + HLE path at native 320x240, low graphics accuracy, nearest filtering, and no duplicate frame uploads.
- Removes Parallel N64's additional 15% analogue dead zone so the shell's responsive 7% dead zone is the only one applied.
- Coalesces redundant touch-axis events to one current joystick vector per display frame while keeping initial contact, release, and every button press immediate.
- Keeps the stock 2048-sample N64 core buffer and 64 ms frontend audio buffer for stability.

Build 15.2 Mupen attempt (superseded by the turbo profile above)
- Replaces Parallel N64 with the official bundled Mupen64Plus-Next core, matching the N64 core used by earlier CSD source variants.
- Selects Mupen's modern WebGL2 package on supported devices instead of the legacy WebGL1 package that was slowing both gameplay and audio.
- Runs N64 at native 320x240 with GLideN64 and the HLE RSP performance path.
- Disables the hybrid scaling filter, anti-aliasing, texture-cache disk work, duplicate-frame uploads, and the threaded renderer that trades input latency for throughput.
- Keeps original game timing and the stock 64 ms audio buffer; audio no longer needs to conceal an under-speed core.

A16 control-latency repair
- Reduces the physical joystick dead zone from 33% of its travel to approximately 7%, then rescales the remaining travel to the full analogue range.
- Delivers button and joystick input to the emulator before audio-resume, vibration, controller-rumble, or visual feedback work.
- Uses the direct libretro input bridge for normal gameplay controls and avoids the extra EmulatorJS menu/netplay routing layer.
- Keeps Android gameplay haptics but shortens phone vibration to a maximum of 6 ms and defers it until after the input call.
- Promotes only the two joystick knobs to compositor layers and removes active-button filter repaints in the balanced Android profile.
- Uses the modern WebGL2 Parallel N64 renderer on the balanced A16/Android profile.
- Restores the stock 64 ms audio buffer so sound response does not add another 32 ms of perceived control delay.

Galaxy A16 5G / Android performance repair
- Replaces EmulatorJS's permanent 10 ms external-gamepad polling with adaptive polling: 16 ms only while a controller is connected, 250 ms while idle, and 500 ms in the background.
- Terminates the gamepad loop when returning HOME, preventing one additional polling loop from accumulating after every game launch.
- Uses direct shell controls on Android instead of creating seventeen transparent iOS-native switch overlays.
- Adds a balanced Android compositor profile that keeps the PSP/XMB design but freezes perpetual star/wave effects and removes the heaviest blur/blend layers.
- Retains native emulation speed, VSync, and disabled smoothing/shaders.
- Suppresses duplicate analogue input calls and removes the unused 140 KB shader catalog from the launch path.
- Reduces the optional camera background from 1080p60 to 720p30 on Android and stops it before gameplay as before.

Preserved from Build 14.2.1

Joy-Con orientation docking + N64 performance repair
- Adds a replayable shell animation: the left Joy-Con docks from above and the right Joy-Con docks from below whenever the device returns from portrait to landscape.
- Replays on first landscape view and on bfcache page restoration, while temporarily disabling controller hitboxes during the 0.8-second movement.
- Restores EmulatorJS 4.2.3's stock RetroArch timing baseline: 64 ms audio latency, VSync on, smoothing off, and no shell-forced audio-sync/rate-control/threaded-video/frame-delay overrides.
- Removes the 300-frame requestAnimationFrame input/audio polling loop. Controls are now fully event-driven and queued inputs are flushed once when the core is ready.
- Stops repeatedly searching and resuming AudioContext objects on every frame and every button press. Gameplay audio is resumed once at startup and once after returning from the background.
- Lets EmulatorJS select the modern WebGL2 core directly instead of coupling legacy-core selection to a separate WebAssembly SIMD probe.
- Removes unverified Parallel N64 option overrides and uses the bundled core's own defaults.
- Disables periodic full-savestate serialization and WASM frame polling during N64/DS gameplay. WebGL context-loss recovery remains active.
- N64/DS HOME exits immediately and relies on normal SRAM/save-file shutdown instead of blocking on a full checkpoint.
- Stops shell clock/animation/compositor work while gameplay is active.

Controls and stability
- Retains the corrected N64 mapping, proportional left stick, C-button right stick, pointer capture, pressed states, haptics, same-document HOME transition, service-worker no-reload behavior, and WebGL context-loss recovery.

Deployment
1. Replace every hosted file with the complete Build 15.3 folder.
2. Confirm sw.js starts with csd-offline-v15.3.0.
3. Wait for GitHub Pages deployment.
4. Open reset.html once. ROMs stored in IndexedDB are preserved.
5. Delete and re-add the iPhone Home Screen icon.


BUILD 14.2.1 CHANGES (included)
- Game launches now show the GAMEX COMPUTER ENTERTAINMENT -> CSD 1 boot animation instead of core initialization text.
- The XMB sys-msg toast overlay is disabled, removing all 18 UI toast messages.
