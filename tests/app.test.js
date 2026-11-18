const test = require("node:test");
const assert = require("node:assert");
const { ManuscriptAnalyzer } = require("../app.js");

const texte = "Marie marche dans Paris. Elle a peur du danger, mais le sourire de Marie rassure Paul. Paul reste chez Marie.";

test("genererScores returns 9 numeric scores within 5..10, never NaN", () => {
  const a = new ManuscriptAnalyzer(texte, "T", "A");
  const scores = a.genererScores(texte, a.detecterPhrases(texte));
  const keys = Object.keys(scores);
  assert.strictEqual(keys.length, 9);
  for (const k of keys) {
    assert.ok(Number.isFinite(scores[k]), `${k} must be finite`);
    assert.ok(scores[k] >= 5 && scores[k] <= 10, `${k} out of range`);
  }
});

test("analyserComplet computes statistics and metadata", () => {
  const r = new ManuscriptAnalyzer(texte, "Titre").analyserComplet();
  assert.strictEqual(r.statistiques.nbPhrases, 3);
  assert.strictEqual(r.statistiques.nbMots, texte.split(/\s+/).length);
  assert.strictEqual(r.metadata.auteur, "Auteur inconnu");
  assert.ok(r.recommandations.forces.includes("Potentiel dramatique net"));
});

test("detecterLieux finds capitalised places", () => {
  const lieux = new ManuscriptAnalyzer(texte, "T").detecterLieux(texte);
  assert.ok(lieux.some(l => l.nom === "Paris"));
});
