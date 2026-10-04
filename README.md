document.addEventListener('DOMContentLoaded', () => {
  initialiserApplication();
});

function initialiserApplication() {
  const fichierInput = document.getElementById('manuscrit');
  const btnAnalyser = document.getElementById('btn-analyser');
  const btnReset = document.getElementById('btn-reset');
  const btnHero = document.getElementById('btn-hero-analyse');
  const btnExport = document.getElementById('btn-export');
  const tabs = document.querySelectorAll('.tab-btn');
  const planButtons = document.querySelectorAll('[data-plan]');

  if (fichierInput) fichierInput.addEventListener('change', gererFichier);
  if (btnAnalyser) btnAnalyser.addEventListener('click', lancerAnalyse);
  if (btnReset) btnReset.addEventListener('click', recommencer);
  if (btnHero) btnHero.addEventListener('click', () => document.getElementById('accueil')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  if (btnExport) btnExport.addEventListener('click', exporterRapport);

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => basculerTab(btn.dataset.tab));
  });

  planButtons.forEach((btn) => {
    btn.addEventListener('click', () => selectionnerPlan(btn.dataset.plan));
  });
}

function gererFichier(event) {
  const fichier = event.target.files?.[0];
  if (!fichier) return;

  const fileName = document.getElementById('file-name');
  if (fileName) {
    fileName.textContent = `${fichier.name} (${formatTaille(fichier.size)})`;
  }

  if (fichier.size > CONFIG.MAX_FILE_SIZE) {
    alert('Le fichier est trop volumineux. Merci d’utiliser un manuscrit de moins de 5 Mo.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const zoneTexte = document.getElementById('texte-direct');
    if (zoneTexte) zoneTexte.value = e.target.result;
  };

  reader.readAsText(fichier);
}

function formatTaille(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

async function lancerAnalyse() {
  const titre = document.getElementById('titre')?.value.trim();
  const auteur = document.getElementById('auteur')?.value.trim();
  const texte = document.getElementById('texte-direct')?.value.trim();

  if (!titre) {
    alert('Merci d’indiquer un titre pour votre manuscrit.');
    return;
  }

  if (!texte || texte.length < 100) {
    alert('Le texte doit contenir au moins 100 caractères pour lancer l’analyse.');
    return;
  }

  afficherSection('chargement');
  demarrerProgression();

  try {
    const resultats = await effectuerAnalyse(texte, titre, auteur || 'Auteur inconnu');
    renderResultats(resultats);
    afficherSection('resultats');
  } catch (error) {
    console.error(error);
    alert('Une erreur est survenue pendant l’analyse. Merci de réessayer.');
    afficherSection('accueil');
  }
}

function afficherSection(id) {
  document.querySelectorAll('.section').forEach((section) => {
    section.style.display = 'none';
  });

  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
}

async function effectuerAnalyse(texte, titre, auteur) {
  const messages = [
    'Lecture du manuscrit…',
    'Analyse de la structure…',
    'Repérage des personnages…',
    'Vérification de la cohérence…',
    'Évaluation du rythme…',
    'Détection des répétitions…',
    'Synthèse de la Bible du roman…',
    'Production du rapport final…'
  ];

  const messageEl = document.getElementById('loader-message');
  const progressEl = document.getElementById('progress');

  for (let i = 0; i < messages.length; i++) {
    if (messageEl) messageEl.textContent = messages[i];
    if (progressEl) progressEl.style.width = `${((i + 1) / messages.length) * 100}%`;
    await attendre(450);
  }

  const analyzer = new ManuscriptAnalyzer(texte, titre, auteur);
  return analyzer.analyserComplet();
}

function demarrerProgression() {
  const progressEl = document.getElementById('progress');
  if (progressEl) progressEl.style.width = '0%';
}

function attendre(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderResultats(resultats) {
  const infoEl = document.getElementById('manuscrit-info');
  if (infoEl) {
    const { titre, auteur } = resultats.metadata;
    const { nbMots, tempsLectureMin } = resultats.statistiques;
    infoEl.textContent = `${titre} — ${auteur} • ${nbMots.toLocaleString('fr-FR')} mots • ${tempsLectureMin} min de lecture`;
  }

  remplirDiagnostic(resultats);
  remplirBible(resultats);
  remplirCoherence(resultats);
  remplirRepetitions(resultats);
  remplirRythme(resultats);
  remplirPersonnages(resultats);
  remplirEmotion(resultats);
  remplirStyle(resultats);
  remplirPlan(resultats);
}

function remplirDiagnostic(r) {
  const scores = r.scores;
  const html = `
    <h3>Diagnostic général</h3>
    <p class="muted">Vue d’ensemble sur 8 critères essentiels.</p>
    <div class="score-grid">
      ${genererCarteScore('Structure', scores.structure)}
      ${genererCarteScore('Personnages', scores.personnages)}
      ${genererCarteScore('Cohérence', scores.coherence)}
      ${genererCarteScore('Rythme', scores.rythme)}
      ${genererCarteScore('Émotion', scores.emotion)}
      ${genererCarteScore('Dialogues', scores.dialogues)}
      ${genererCarteScore('Immersion', scores.immersion)}
      ${genererCarteScore('Style', scores.style)}
    </div>

    <div class="alert alert-info">
      <div class="alert-title">Potentiel estimé</div>
      <p>Score estimé : <strong>${scores.potentiel}/10</strong></p>
      <p>Votre manuscrit présente une base solide, avec quelques axes de travail prioritaires identifiés ci-dessous.</p>
    </div>

    <ul class="issue-list" style="margin-top:20px;">
      <li class="issue-item"><strong>${r.statistiques.nbMots.toLocaleString('fr-FR')}</strong> mots</li>
      <li class="issue-item"><strong>${r.statistiques.nbPhrases}</strong> phrases détectées</li>
      <li class="issue-item"><strong>${r.statistiques.longueurMoyennePhrase}</strong> mots par phrase en moyenne</li>
      <li class="issue-item"><strong>${r.statistiques.nbChapitres}</strong> chapitre(s) détecté(s)</li>
    </ul>
  `;

  document.getElementById('tab-diagnostic').innerHTML = html;
}

function genererCarteScore(label, score) {
  const valeur = Number(score);
  const classe = valeur >= 7 ? 'high' : valeur >= 5 ? 'medium' : 'low';
  return `
    <div class="score-card ${classe}">
      <div class="score-label">${label}</div>
      <div class="score-value ${classe}">${score}</div>
    </div>
  `;
}

function remplirBible(r) {
  const bible = r.bible;
  let html = `
    <h3>Bible du roman</h3>
    <p class="muted">Mémoire narrative automatique. Idéal pour conserver les règles du monde.</p>
    <div class="alert alert-info">
      <div class="alert-title">Résumé global</div>
      <p>${bible.resumeGlobal}</p>
    </div>
  `;

  if (bible.personnages.length) {
    html += `<h4 style="margin-top:22px;">Personnages</h4>`;
    bible.personnages.forEach((p) => {
      html += `
        <div class="character-card">
          <div class="character-name">${p.nom}</div>
          <div class="character-info">
            <div><strong>Rôle :</strong> ${p.role}</div>
            <div><strong>Apparitions :</strong> ${p.apparitions}</div>
            <div><strong>Première apparition :</strong> ${p.premiereApparition}</div>
          </div>
          <p>${p.description}</p>
        </div>
      `;
    });
  }

  if (bible.lieux.length) {
    html += `
      <h4 style="margin-top:20px;">Lieux</h4>
      <ul class="issue-list">
        ${bible.lieux.map((l) => `<li class="issue-item"><strong>${l.nom}</strong> — ${l.mentions} mentions</li>`).join('')}
      </ul>
    `;
  }

  if (bible.chronologie.length) {
    html += `
      <h4 style="margin-top:20px;">Chronologie</h4>
      <div class="timeline">
        ${bible.chronologie.map((item) => `
          <div class="timeline-item"><strong>${item.evenement}</strong> — ${item.mentions} mentions</div>
        `).join('')}
      </div>
    `;
  }

  document.getElementById('tab-bible').innerHTML = html;
}

function remplirCoherence(r) {
  const recos = r.recommandations.problemes.filter((p) => p.type === 'coherence');
  let html = `<h3>Cohérence narrative</h3>`;

  if (recos.length) {
    recos.forEach((p) => {
      html += genererCarteProbleme(p);
    });
  } else {
    html += `<div class="alert alert-success"><div class="alert-title">Aucune incohérence majeure détectée</div><p>Le récit semble cohérent sur les points analysés.</p></div>`;
  }

  document.getElementById('tab-coherence').innerHTML = html;
}

function remplirRepetitions(r) {
  const { ideesRepetees, motsRepetes } = r.repetitions;
  let html = `<h3>Répétitions</h3>`;

  if (motsRepetes.length) {
    html += `
      <h4>Mots répétés</h4>
      <div class="score-grid">
        ${motsRepetes.map((item) => `
          <div class="score-card medium">
            <div class="score-label">${item.mot}</div>
            <div class="score-value medium">${item.occurrences}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (!ideesRepetees.length && !motsRepetes.length) {
    html += `<div class="alert alert-success"><div class="alert-title">Variété satisfaisante</div><p>Peu de répétitions onéreuses détectées.</p></div>`;
  }

  document.getElementById('tab-repetitions').innerHTML = html;
}

function remplirRythme(r) {
  const rythme = r.rythme;
  const html = `
    <h3>Analyse du rythme</h3>
    <div class="score-grid">
      <div class="score-card"><div class="score-label">Dialogues</div><div class="score-value">${rythme.ratioDialogues}%</div></div>
      <div class="score-card"><div class="score-label">Descriptions</div><div class="score-value">${rythme.ratioDescription}%</div></div>
      <div class="score-card"><div class="score-label">Action</div><div class="score-value">${rythme.ratioAction}%</div></div>
      <div class="score-card"><div class="score-label">Paragraphe moyen</div><div class="score-value">${rythme.longueurMoyenneParagraphe}</div></div>
    </div>
    <div class="alert alert-warning">
      <div class="alert-title">Conseil</div>
      <p>Alternez les longues descriptions avec des scènes de tension plus directes pour améliorer la dynamique.</p>
    </div>
  `;

  document.getElementById('tab-rythme').innerHTML = html;
}

function remplirPersonnages(r) {
  let html = `<h3>Personnages</h3>`;

  if (r.personnages.length) {
    r.personnages.forEach((p) => {
      html += `
        <div class="character-card">
          <div class="character-name">${p.nom}</div>
          <div class="character-info">
            <div><strong>Occurrences :</strong> ${p.occurrences}</div>
            <div><strong>Action :</strong> ${p.action}</div>
            <div><strong>Contexte :</strong> ${p.contexte}</div>
          </div>
        </div>
      `;
    });
  }

  document.getElementById('tab-personnages').innerHTML = html;
}

function remplirEmotion(r) {
  const entries = Object.entries(r.emotion);
  let html = `
    <h3>Émotion</h3>
    <div style="display:grid; gap:16px; margin-top:20px;">
      ${entries.map(([emotion, data]) => `
        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <strong>${emotion}</strong>
            <span>${data.intensite.toFixed(0)}%</span>
          </div>
          <div style="height:16px; border-radius:999px; overflow:hidden; background:rgba(148,163,184,0.12);">
            <div style="width:${data.intensite}%; height:100%; background:linear-gradient(90deg, var(--primary), var(--primary-2));"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('tab-emotion').innerHTML = html;
}

function remplirStyle(r) {
  const style = r.style;
  const html = `
    <h3>Style</h3>
    <div class="score-grid">
      <div class="score-card"><div class="score-label">Longueur moyenne</div><div class="score-value">${style.longueurMoyenne}</div></div>
      <div class="score-card"><div class="score-label">Temps verbal</div><div class="score-value">${style.tempsDominant}</div></div>
      <div class="score-card"><div class="score-label">Phrases courtes</div><div class="score-value">${style.phrasesCourtes}</div></div>
      <div class="score-card"><div class="score-label">Phrases longues</div><div class="score-value">${style.phrasesLongues}</div></div>
    </div>
    <div class="alert alert-info">
      <div class="alert-title">Tics d’écriture</div>
      <p>${style.tics.length ? style.tics.map((t) => `${t.mot} (${t.occurrences})`).join(', ') : 'Aucun tic majeur détecté.'}</p>
    </div>
  `;

  document.getElementById('tab-style').innerHTML = html;
}

function remplirPlan(r) {
  const recos = r.recommandations;
  let html = `
    <h3>Plan de révision</h3>
    <div class="alert alert-danger">
      <div class="alert-title">Priorités</div>
      <ul class="issue-list">
        ${recos.problemes.map((p) => `<li class="issue-item"><strong>${p.titre}</strong> — ${p.description}</li>`).join('')}
      </ul>
    </div>
    <div class="alert alert-success">
      <div class="alert-title">Forces</div>
      <ul class="issue-list">
        ${recos.foces ? recos.foces.map((f) => `<li class="issue-item">${f}</li>`).join('') : recos.forces.map((f) => `<li class="issue-item">${f}</li>`).join('')}
      </ul>
    </div>
    <ol class="issue-list" style="margin-top:20px;">
      ${recos.planRevision.map((item) => `<li class="issue-item">${item}</li>`).join('')}
    </ol>
  `;

  document.getElementById('tab-plan').innerHTML = html;
}

function basculerTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
  document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.toggle('active', pane.id === `tab-${tabId}`));
}

function recommencer() {
  const texte = document.getElementById('texte-direct');
  const titre = document.getElementById('titre');
  const auteur = document.getElementById('auteur');
  const input = document.getElementById('manuscrit');

  if (texte) texte.value = '';
  if (titre) titre.value = '';
  if (auteur) auteur.value = '';
  if (input) input.value = '';

  const fileName = document.getElementById('file-name');
  if (fileName) fileName.textContent = 'TXT, DOCX ou PDF (lecture directe en texte brut)';

  afficherSection('accueil');
}

function selectionnerPlan(planId) {
  const plan = CONFIG.PRICING[planId];
  if (!plan) return;

  const confirmation = confirm(`${plan.nom} — ${plan.prix}€/mois\n\n${plan.description}\n\nVoulez-vous continuer ?`);
  if (confirmation) {
    alert(`Plan ${plan.nom} sélectionné. L’intégration de paiement peut être ajoutée ensuite.`);
  }
}

function exporterRapport() {
  const body = document.body.innerHTML;
  const titulo = document.getElementById('manuscrit-info')?.textContent || 'Manuscrit Pro';
  const report = document.getElementById('tab-diagnostic')?.innerText || '';

  const content = `Manuscrit Pro\n${titulo}\n\n${report}`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${titulo.replace(/\s+/g, '-').toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function genererCarteProbleme(p) {
  const classe = p.gravite === 'rouge' ? 'danger' : p.gravite === 'orange' ? 'warning' : 'info';
  const icone = p.gravite === 'rouge' ? '🔴' : p.gravite === 'orange' ? '🟠' : '🔵';

  return `
    <div class="alert alert-${classe}">
      <div class="alert-title">${icone} ${p.titre}</div>
      <p>${p.description}</p>
      ${p.solutions ? `
        <div style="margin-top:10px;">
          <strong>Solutions :</strong>
          <ul class="issue-list" style="margin-top:8px;">
            ${p.solutions.map((s) => `<li class="issue-item">${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

function genererRapportTexte(r) {
  return `Rapport Manuscrit Pro\n${r.metadata.titre}\n${r.metadata.auteur}\n\n${Object.entries(r.scores).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
}

window.renderResultats = renderResultats;
window.genererRapportTexte = genererRapportTexte;
