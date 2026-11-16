const display = document.getElementById("display");

let isDegree = true;

// Ajouter des valeurs dans l'écran
function append(value) {
  if (display.value === "Erreur") {
    display.value = "";
  }

  display.value += value;
}

// Effacer tout
function clearDisplay() {
  display.value = "";
}

// Supprimer le dernier caractère
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Changer DEG / RAD
function toggleMode() {
  isDegree = !isDegree;

  document.getElementById("angleMode").textContent = isDegree ? "DEG" : "RAD";
}

// Fonctions trigonométriques
function sin(x) {
  return Math.sin(isDegree ? (x * Math.PI) / 180 : x);
}

function cos(x) {
  return Math.cos(isDegree ? (x * Math.PI) / 180 : x);
}

function tan(x) {
  return Math.tan(isDegree ? (x * Math.PI) / 180 : x);
}

// Calculer le résultat
function calculate() {
  try {
    let expression = display.value;

    if (!expression) return;

    // Vérifier les caractères autorisés
    if (!/^[0-9a-z+\-*/().%^]+$/i.test(expression)) {
      throw new Error("Expression invalide");
    }

    // Remplacer les fonctions scientifiques
    expression = expression
      .replace(/pi/gi, String(Math.PI))
      .replace(/\be\b/g, String(Math.E))
      .replace(/sqrt\(/gi, "Math.sqrt(")
      .replace(/log\(/gi, "Math.log10(")
      .replace(/ln\(/gi, "Math.log(");

    // Remplacer les puissances
    expression = expression.replace(/\^/g, "**");

    // Convertir les pourcentages
    expression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    // Autoriser uniquement les fonctions prévues
    const allowed = ["Math.sqrt", "Math.log10", "Math.log"];

    let check = expression
      .replace(/Math\.(sqrt|log10|log)/g, "")
      .replace(/sin|cos|tan/g, "")
      .replace(/[0-9+\-*/().%]+/g, "");

    if (check.length !== 0) {
      throw new Error("Expression invalide");
    }

    // Évaluer l'expression avec les fonctions autorisées
    const result = Function(
      "sin",
      "cos",
      "tan",
      `"use strict"; return (${expression});`,
    )(sin, cos, tan);

    if (!Number.isFinite(result)) {
      throw new Error("Résultat impossible");
    }

    display.value = Number(result.toPrecision(12));
  } catch (error) {
    display.value = "Erreur";
  }
}
