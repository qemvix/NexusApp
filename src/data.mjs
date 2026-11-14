export const release = {
  "version": "0.2.2",
  "date": "2026-11-14",
  "platform": "Windows x64",
  "tag": "desktop-v0.2.2",
  "repository": "https://github.com/qemvix/nexus",
  "installer": "https://github.com/qemvix/nexus/releases/download/desktop-v0.2.2/Nexus-Setup.exe",
  "portable": "https://github.com/qemvix/nexus/releases/download/desktop-v0.2.2/Nexus-0.2.2-win-x64-portable.zip",
  "checksums": "https://github.com/qemvix/nexus/releases/download/desktop-v0.2.2/SHA256SUMS.txt"
};

export const families = {
  "cursor": {
    "name": "Cursor & mouse",
    "description": "Five ways to make movement, clicks and small details feel better."
  },
  "desktop": {
    "name": "Desktop",
    "description": "Four tools for windows, focus, useful information and the text you just copied."
  },
  "productivity": {
    "name": "Productivity",
    "description": "Four quiet helpers for measuring, presenting and controlling your workspace."
  }
};

export const modules = [
  {
    "id": "scrollflow",
    "name": "ScrollFlow",
    "family": "cursor",
    "symbol": "≋",
    "description": "Glide-powered smooth scrolling with per-app profiles and exclusions.",
    "features": [
      "Finite eased scrolling pulses",
      "Native touchpad gestures where supported",
      "Horizontal and vertical wheel fallback",
      "Per-app speed, inversion and glide duration",
      "App exclusions and fullscreen pausing"
    ],
    "permissions": [
      "Mouse"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "Run ScrollFlow instead of standalone Glide. Native gestures require OS support; some applications coalesce fallback wheel packets.",
    "source": "https://github.com/qemvix/Glide",
    "sourceLabel": "Built on Glide"
  },
  {
    "id": "cursorblur",
    "name": "CursorBlur",
    "family": "cursor",
    "symbol": "↗",
    "description": "Runs the original CursorBlur engine with a single toggle.",
    "features": [
      "Original native CursorBlur engine",
      "No settings or Configure screen",
      "Starts and stops with its module",
      "Duplicate-engine protection",
      "Stops even if the Nexus host crashes"
    ],
    "permissions": [
      "Mouse"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "Uses its own defaults and timing; WPF FPS and reduced-motion controls do not change it. Disable it to stop motion. Requires the Microsoft Visual C++ v14 x64 runtime; missing dependencies show Runtime help.",
    "source": "https://github.com/qemvix/CursorBlur",
    "sourceLabel": "Original CursorBlur"
  },
  {
    "id": "cursoraura",
    "name": "Cursor Aura",
    "family": "cursor",
    "symbol": "◎",
    "description": "Glow, trails, particles and a spotlight around the pointer.",
    "features": [
      "Five visual treatments",
      "Adjustable radius and opacity",
      "Custom accent color",
      "Click-through desktop overlay"
    ],
    "permissions": [
      "Mouse"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "The soft halo is a visual glow. For a trail of the actual cursor image, use CursorBlur. Click animation lives in ClickFX."
  },
  {
    "id": "clickfx",
    "name": "ClickFX",
    "family": "cursor",
    "symbol": "◌",
    "description": "Click overlays with ripples, rings or shockwaves.",
    "features": [
      "Distinct left and right click colors",
      "Ripple, ring and shockwave animations",
      "Radius and duration controls",
      "Optional Windows system sound"
    ],
    "permissions": [
      "Mouse"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "Right-click color is fixed cyan in this release. Custom audio files and independent animation timelines are not included."
  },
  {
    "id": "cursorlens",
    "name": "Cursor Lens",
    "family": "cursor",
    "symbol": "⊕",
    "description": "Mouse-following screen magnification with adjustable zoom and framing.",
    "features": [
      "Real screen magnification",
      "Adjustable zoom and size",
      "Circular or square framing",
      "Optional presentation crosshair",
      "Reusable capture buffers at the shared frame target"
    ],
    "permissions": [
      "Screen"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "Protected video and secure desktop cannot be captured. HDR and mixed-DPI configurations need broader validation."
  },
  {
    "id": "float",
    "name": "Float",
    "family": "desktop",
    "symbol": "▦",
    "description": "Clock, CPU, memory, media keys and optional weather in a floating widget.",
    "features": [
      "CPU, physical RAM and clock",
      "Windows and processor information",
      "Previous, play/pause and next keys",
      "Optional coordinate-based weather",
      "Always-on-top preference"
    ],
    "permissions": [
      "Optional network for weather"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "Weather is fetched on enable. Now-playing titles, a widget designer and periodic weather refresh are not included."
  },
  {
    "id": "windowglide",
    "name": "WindowGlide",
    "family": "desktop",
    "symbol": "▥",
    "description": "Snap windows into presets or custom zones using global shortcuts.",
    "features": [
      "Half, quarter and third layouts",
      "Custom normalized zones via JSON",
      "Magnetic left and right edges",
      "Eased window movement",
      "Monitor work-area placement"
    ],
    "permissions": [
      "Window control"
    ],
    "shortcut": "Ctrl + Alt + arrow keys",
    "limit": "Targets normal captioned windows. Elevated or protected applications can reject changes; a visual layout designer is still planned."
  },
  {
    "id": "clipvault",
    "name": "ClipVault",
    "family": "desktop",
    "symbol": "▤",
    "description": "Search, pin and copy from an in-memory text and rich-text history.",
    "features": [
      "Search up to 100 text/RTF entries",
      "Pin and sort useful snippets",
      "Copy rich or plain text",
      "Delete an entry or clear the history",
      "Memory-only storage"
    ],
    "permissions": [
      "Clipboard"
    ],
    "shortcut": "Ctrl + Alt + V",
    "limit": "History and pins are erased when the module stops or Nexus exits. No password-manager exclusion enforcement, image history or persistent vault is claimed."
  },
  {
    "id": "focusfade",
    "name": "FocusFade",
    "family": "desktop",
    "symbol": "◧",
    "description": "Dim the area outside the active window.",
    "features": [
      "Click-through dimming",
      "Adjustable dim amount",
      "Accent outline controls",
      "Nexus hub remains clear"
    ],
    "permissions": [
      "Window control"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "This release dims surroundings; it does not automatically hide windows or provide app exclusions and animated focus transitions."
  },
  {
    "id": "screenruler",
    "name": "ScreenRuler",
    "family": "productivity",
    "symbol": "⌗",
    "description": "Measure pixels, read coordinates and copy screen colors.",
    "features": [
      "Crosshair and ruler overlays",
      "Anchored rectangle measurement",
      "Physical-pixel coordinates",
      "Copy a pixel color as a hex value"
    ],
    "permissions": [
      "Screen"
    ],
    "shortcut": "Ctrl + Alt + R / C",
    "limit": "Ruler labels are monitor-local. Capture colors are SDR values, and unusual scaling or rotated displays need testing."
  },
  {
    "id": "keycast",
    "name": "KeyCast",
    "family": "productivity",
    "symbol": "⌨",
    "description": "Display keys, shortcuts and mouse-button presses during recordings.",
    "features": [
      "Shortcut and all-keys modes",
      "Mouse-button display",
      "Color, size and duration controls",
      "No keystroke log written to disk"
    ],
    "permissions": [
      "Keyboard",
      "Mouse"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "All-keys mode can expose passwords on screen. There is no automatic password-field detection; pause it before sensitive typing."
  },
  {
    "id": "glassify",
    "name": "Glassify",
    "family": "productivity",
    "symbol": "◇",
    "description": "Change window opacity and always-on-top behavior.",
    "features": [
      "Window opacity control",
      "Active-window or process-list targeting",
      "Always-on-top preference",
      "Original state restored on normal stop"
    ],
    "permissions": [
      "Window control"
    ],
    "shortcut": "Choose a toggle in Hotkeys",
    "limit": "Effects are best effort. No arbitrary third-party blur is included. Forced termination can prevent restoration; topmost behavior requires manual validation on some systems."
  },
  {
    "id": "quickdock",
    "name": "QuickDock",
    "family": "productivity",
    "symbol": "⊞",
    "description": "Media and volume controls, with links to Windows settings.",
    "features": [
      "Volume and media keys",
      "Windows sound mixer link",
      "Display and brightness settings",
      "Wi-Fi, Bluetooth, accessibility and power settings"
    ],
    "permissions": [
      "No special module grant"
    ],
    "shortcut": "Ctrl + Alt + Q",
    "limit": "Device buttons open native Windows settings. Nexus does not claim embedded Wi-Fi scans, Bluetooth switches or a universal hardware brightness slider."
  }
];

export const faq = [
  [
    "Which Windows versions does Nexus support?",
    "The current release is Windows x64. Windows 11 is the primary tested platform; broader Windows 10 and mixed-DPI hardware validation is still pending. macOS and Linux binaries are not available."
  ],
  [
    "Do I need to install .NET or run as administrator?",
    "No separate .NET runtime is needed: the installer and portable app are self-contained. Installation is per user and requests no administrator elevation. Some elevated or protected apps may reject control from Nexus. The original CursorBlur engine additionally needs the Microsoft Visual C++ v14 x64 runtime, with an actionable error if it is missing."
  ],
  [
    "What does “Blocked” mean?",
    "The feature is enabled but has not received a capability it needs. Open Permissions and review the relevant mouse, keyboard, screen, clipboard or window-control grant. Nexus starts it when its requirements are granted."
  ],
  [
    "Can I run ScrollFlow and Glide together?",
    "Use one scrolling engine at a time. Exit standalone Glide before enabling ScrollFlow. Nexus detects an already-running Glide process and reports a clear error instead of starting a second engine."
  ],
  [
    "Will all overlays run at 240 FPS?",
    "240 is a selectable target, not a guarantee. The default target is 60 FPS. Monitor refresh, WPF composition, capture cost and enabled effects affect delivery. Settings reports measured rendering callback rates; local clock tests observed about 60 at target 60 and roughly 72–81 at target 144. CursorBlur runs the original native executable with independent timing."
  ],
  [
    "Is my clipboard or typing saved?",
    "ClipVault keeps a bounded text/RTF history in memory while enabled and clears it on stop or exit. KeyCast displays recent inputs without saving a log. Both require capability grants. Clipboard contents can still contain secrets, and all-keys display can reveal sensitive typing on screen."
  ],
  [
    "What happens when I close the settings window?",
    "Nexus stays in the Windows notification area. Ctrl+Alt+N reopens the hub, Ctrl+Alt+P pauses all modules, and Exit Nexus in the tray menu releases hooks, overlays and timers."
  ],
  [
    "Is Nexus open source?",
    "Nexus is proprietary. Official releases are permitted for personal desktop use under the supplied license. Other reproduction, modification, redistribution, sublicensing, sale or derivative work requires the written permission described in the license. Third-party components retain their own terms."
  ],
  [
    "Does uninstalling remove my settings?",
    "Windows Installed Apps removes the installed executable and shortcut. Local settings are retained in %LOCALAPPDATA%\\Nexus. In-app feature uninstall resets that feature’s options and resources; shared family code stays in the unified app."
  ],
  [
    "Why does Windows say the publisher is unknown?",
    "This release is unsigned. The release does not carry an Authenticode publisher signature. Review the release notes and compare the supplied hashes; hashes alone do not establish a publisher identity."
  ],
  [
    "Do I need an account or a subscription?",
    "There is no Nexus account system or subscription dependency in the app. Optional weather and publisher-configured update checks use the network when permitted. The official signed update feed and trusted key are included. Update checks require Network permission; daily checks are optional."
  ],
  [
    "How do updates work?",
    "In Settings & updates, choose Check for updates, then Download and install when a release is available. Nexus verifies the signed manifest and installer hash, updates the per-user installation and keeps your settings. Network permission is required; daily checks are optional."
  ]
];
