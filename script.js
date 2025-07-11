class PasswordGenerator {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.generatePassword();
  }

  initializeElements() {
    // Main elements
    this.passwordOutput = document.getElementById("passwordOutput");
    this.copyBtn = document.getElementById("copyBtn");
    this.generateBtn = document.getElementById("generateBtn");
    this.refreshBtn = document.getElementById("refreshBtn");

    // Settings elements
    this.passwordLength = document.getElementById("passwordLength");
    this.lengthValue = document.getElementById("lengthValue");
    this.uppercase = document.getElementById("uppercase");
    this.lowercase = document.getElementById("lowercase");
    this.numbers = document.getElementById("numbers");
    this.symbols = document.getElementById("symbols");
    this.symbolCount = document.getElementById("symbolCount");
    this.numberCount = document.getElementById("numberCount");

    // Strength meter elements
    this.strengthFill = document.getElementById("strengthFill");
    this.strengthText = document.getElementById("strengthText");

    // Character sets
    this.characterSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };
  }

  bindEvents() {
    // Password length slider
    this.passwordLength.addEventListener("input", (e) => {
      this.lengthValue.textContent = e.target.value;
      this.generatePassword();
    });

    // Character type checkboxes
    [this.uppercase, this.lowercase, this.numbers, this.symbols].forEach(
      (checkbox) => {
        checkbox.addEventListener("change", () => {
          this.validateSettings();
          this.generatePassword();
        });
      }
    );

    // Count inputs
    [this.symbolCount, this.numberCount].forEach((input) => {
      input.addEventListener("input", () => {
        this.validateSettings();
        this.generatePassword();
      });
    });

    // Buttons
    this.generateBtn.addEventListener("click", () => {
      this.generatePassword();
    });

    this.refreshBtn.addEventListener("click", () => {
      this.generatePassword();
    });

    this.copyBtn.addEventListener("click", () => {
      this.copyPassword();
    });

    // Auto-generate on page load
    this.generatePassword();
  }

  validateSettings() {
    const length = parseInt(this.passwordLength.value);
    const symbolCount = parseInt(this.symbolCount.value);
    const numberCount = parseInt(this.numberCount.value);

    // Ensure symbol and number counts don't exceed password length
    const maxSpecialChars = Math.min(length, 10);

    if (symbolCount > maxSpecialChars) {
      this.symbolCount.value = maxSpecialChars;
    }

    if (numberCount > maxSpecialChars) {
      this.numberCount.value = maxSpecialChars;
    }

    // Ensure at least one character type is selected
    const hasCharacterType =
      this.uppercase.checked ||
      this.lowercase.checked ||
      this.numbers.checked ||
      this.symbols.checked;

    if (!hasCharacterType) {
      this.lowercase.checked = true;
    }
  }

  generatePassword() {
    this.validateSettings();

    const length = parseInt(this.passwordLength.value);
    const symbolCount = parseInt(this.symbolCount.value);
    const numberCount = parseInt(this.numberCount.value);

    let password = "";
    let availableChars = "";

    // Build available character set based on selections
    if (this.uppercase.checked) availableChars += this.characterSets.uppercase;
    if (this.lowercase.checked) availableChars += this.characterSets.lowercase;
    if (this.numbers.checked) availableChars += this.characterSets.numbers;
    if (this.symbols.checked) availableChars += this.characterSets.symbols;

    // Ensure we have at least lowercase if nothing is selected
    if (!availableChars) {
      availableChars = this.characterSets.lowercase;
    }

    // Generate base password
    for (let i = 0; i < length; i++) {
      password += availableChars.charAt(
        Math.floor(Math.random() * availableChars.length)
      );
    }

    // Ensure required symbols and numbers are included
    if (this.symbols.checked && symbolCount > 0) {
      password = this.ensureCharacterCount(
        password,
        this.characterSets.symbols,
        symbolCount
      );
    }

    if (this.numbers.checked && numberCount > 0) {
      password = this.ensureCharacterCount(
        password,
        this.characterSets.numbers,
        numberCount
      );
    }

    // Shuffle the password to make it more random
    password = this.shuffleString(password);

    this.passwordOutput.value = password;
    this.updateStrengthMeter(password);
  }

  ensureCharacterCount(password, characterSet, requiredCount) {
    const passwordArray = password.split("");
    const currentCount = passwordArray.filter((char) =>
      characterSet.includes(char)
    ).length;

    if (currentCount >= requiredCount) {
      return password;
    }

    // Replace random characters with required ones
    const charsToAdd = requiredCount - currentCount;
    const nonRequiredChars = passwordArray.filter(
      (char) => !characterSet.includes(char)
    );

    for (let i = 0; i < charsToAdd && i < nonRequiredChars.length; i++) {
      const randomIndex = Math.floor(Math.random() * passwordArray.length);
      const randomChar = characterSet.charAt(
        Math.floor(Math.random() * characterSet.length)
      );
      passwordArray[randomIndex] = randomChar;
    }

    return passwordArray.join("");
  }

  shuffleString(str) {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  }

  updateStrengthMeter(password) {
    let score = 0;
    const length = password.length;

    // Length score
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;

    // Character variety score
    if (
      this.characterSets.uppercase
        .split("")
        .some((char) => password.includes(char))
    )
      score += 1;
    if (
      this.characterSets.lowercase
        .split("")
        .some((char) => password.includes(char))
    )
      score += 1;
    if (
      this.characterSets.numbers
        .split("")
        .some((char) => password.includes(char))
    )
      score += 1;
    if (
      this.characterSets.symbols
        .split("")
        .some((char) => password.includes(char))
    )
      score += 1;

    // Remove existing classes
    this.strengthFill.className = "strength-fill";
    this.strengthText.className = "";

    // Apply strength classes
    if (score >= 5) {
      this.strengthFill.classList.add("very-strong");
      this.strengthText.classList.add("very-strong");
      this.strengthText.textContent = "Very Strong";
    } else if (score >= 4) {
      this.strengthFill.classList.add("strong");
      this.strengthText.classList.add("strong");
      this.strengthText.textContent = "Strong";
    } else if (score >= 3) {
      this.strengthFill.classList.add("medium");
      this.strengthText.classList.add("medium");
      this.strengthText.textContent = "Medium";
    } else {
      this.strengthFill.classList.add("weak");
      this.strengthText.classList.add("weak");
      this.strengthText.textContent = "Weak";
    }
  }

  async copyPassword() {
    if (!this.passwordOutput.value) return;

    try {
      await navigator.clipboard.writeText(this.passwordOutput.value);

      // Visual feedback
      this.copyBtn.classList.add("copied");
      this.copyBtn.querySelector(".copy-icon").textContent = "✓";

      setTimeout(() => {
        this.copyBtn.classList.remove("copied");
        this.copyBtn.querySelector(".copy-icon").textContent = "📋";
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      this.passwordOutput.select();
      this.passwordOutput.setSelectionRange(0, 99999);
      document.execCommand("copy");

      // Visual feedback
      this.copyBtn.classList.add("copied");
      this.copyBtn.querySelector(".copy-icon").textContent = "✓";

      setTimeout(() => {
        this.copyBtn.classList.remove("copied");
        this.copyBtn.querySelector(".copy-icon").textContent = "📋";
      }, 2000);
    }
  }
}

// Initialize the password generator when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new PasswordGenerator();
});
