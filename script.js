
const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");
const strengthScore = document.getElementById("strength-score");

// PASSWORD ANALYZER
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  const checks = [
    password.length >= 8,
    password.length >= 12,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ];

  const score = checks.filter(Boolean).length;

  if (!password) {
    strengthBar.style.width = "0";
    strengthText.textContent = "AWAITING INPUT";
    strengthScore.textContent = "0 / 5";
    return;
  }

  const levels = [
    ["VERY WEAK", "#ff5555"],
    ["WEAK", "#ff8055"],
    ["FAIR", "#ffc857"],
    ["GOOD", "#d5e95c"],
    ["STRONG", "#a9f45b"],
    ["EXCELLENT", "#c6ff4d"]
  ];

  const level = Math.min(score, 5);
  const [label, color] = levels[level];

  strengthBar.style.width = `${(score / 6) * 100}%`;
  strengthBar.style.background = color;
  strengthText.textContent = label;
  strengthText.style.color = color;
  strengthScore.textContent = `${score} / 6`;
});

// SECURE PASSWORD GENERATOR
function secureRandomIndex(max) {
  const range = 0x100000000;
  const limit = range - (range % max);
  const random = new Uint32Array(1);

  do {
    crypto.getRandomValues(random);
  } while (random[0] >= limit);

  return random[0] % max;
}

document.getElementById("generate").addEventListener("click", () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=";

  let password = "";

  for (let i = 0; i < 20; i++) {
    password += characters[secureRandomIndex(characters.length)];
  }

  document.getElementById("generated").value = password;
  document.getElementById("copy-status").textContent =
    "NEW SECRET GENERATED SUCCESSFULLY";
});

// COPY TO CLIPBOARD
document.getElementById("copy").addEventListener("click", async () => {
  const password = document.getElementById("generated").value;
  const status = document.getElementById("copy-status");

  if (!password) {
    status.textContent = "GENERATE A SECRET FIRST.";
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
    status.textContent = "✓ COPIED TO CLIPBOARD.";
  } catch {
    status.textContent = "CLIPBOARD UNAVAILABLE. COPY MANUALLY.";
  }
});

// URL PROTOCOL INSPECTOR
document.getElementById("check-url").addEventListener("click", () => {
  const value = document.getElementById("url").value.trim();
  const result = document.getElementById("url-result");

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Unsupported protocol");
    }

    if (parsed.protocol === "https:") {
      result.textContent = "✓ HTTPS DETECTED — ENCRYPTED TRANSPORT.";
      result.style.color = "#c6ff4d";
    } else {
      result.textContent = "⚠ HTTP DETECTED — NO TRANSPORT ENCRYPTION.";
      result.style.color = "#ffb45c";
    }
  } catch {
    result.textContent = "✕ INVALID URL — CHECK YOUR INPUT.";
    result.style.color = "#ff5555";
  }
});
