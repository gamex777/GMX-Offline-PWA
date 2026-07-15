CSD Offline PWA — Build 14.2

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
1. Replace every hosted file with the complete Build 14.2 folder.
2. Confirm sw.js starts with csd-offline-v14.2.0.
3. Wait for GitHub Pages deployment.
4. Open reset.html once. ROMs stored in IndexedDB are preserved.
5. Delete and re-add the iPhone Home Screen icon.


BUILD 14.2.1 CHANGES
- Game launches now show the GAMEX COMPUTER ENTERTAINMENT -> CSD 1 boot animation instead of core initialization text.
- The XMB sys-msg toast overlay is disabled, removing all 18 UI toast messages.
