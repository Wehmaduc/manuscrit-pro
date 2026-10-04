// ========================================
// MANUSCRIT PRO - Application principale
// ========================================

// ===== ÉTAT GLOBAL =====
let manuscritActuel = null;
let resultatsActuels = null;
let abonnementActif = false;

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    initialiserApplication();
});

function initialiserApplication() {
    // File upload
    document.getElementById('manuscrit').addEventListener('change', gererFichier);
    
    // Bouton d'analyse
    document.getElementById('btn-analyser').addEventListener('click', lancerAnalyse);
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => basculerTab(btn.dataset.tab));
    });
    
    // Actions du bas
    document.getElementById('btn-export').addEventListener('click', exporterRapport);
    document.getElementById('btn-nouveau').addEventListener('click', recommencer);
    
    // Pricing
    document.querySelectorAll('[data-plan]').forEach(btn => {
        btn.addEventListener('click', () => selectionnerPlan(btn.dataset.plan));
    });
}

// ===== GESTION FICHIER =====
function gererFichier(event) {
    const fichier = event.target.files[0];
    if (!fichier) return;

    const label = document.getElementById('file-name');
    label.textContent = `📄 ${fichier.name} (${formatTaille(fichier.size)})`;

    // Vérification de taille
    if (fichier.size > CONFIG.MAX_FILE_SIZE) {
        alert('Le fichier est trop volumineux (max 5 Mo). Veuillez utiliser un fichier plus petit ou copier le texte directement.');
        return;
    }

    // Lecture du fichier
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('texte-direct').value = e.target.result;
    };
    
    if (fichier.name.endsWith('.txt')) {
        reader.readAsText(fichier);
    } else {
        alert('Pour l\'instant, seuls les fichiers TXT sont supportés en import direct. Pour les autres formats, copiez-collez le texte dans la zone prévue.');
    }
}

function formatTaille(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / 1024 / 1024).toFixed(1) + ' Mo';
}

// ===== LANCEMENT DE L'ANALYSE =====
async function lancerAnalyse() {
    const titre = document.getElementById('titre').value.trim();
    const auteur = document.getElementById('auteur').value.trim();
    const texte = document.getElementById('texte-direct').value.trim();

    if (!texte || texte.length < 100) {
        alert('⚠️ Veuillez fournir un texte d\'au moins 100 caractères pour l\'analyse.');
        return;
    }

    if (!titre) {
        alert('⚠️ Veuillez donner un titre à votre manuscrit.');
        return;
    }

    manuscritActuel = { titre, auteur, texte };

    // Passer à l'écran de chargement
    afficherSection('chargement');
    demarrerProgression();

    try {
        // Lancer l'analyse
        const resultats = await effectuerAnalyse(texte, titre, auteur);
        resultatsActuels = resultats;
        
        // Afficher les résultats
        afficherResultats(resultats);
        afficherSection('resultats');
    } catch (erreur) {
        console.error('Erreur analyse:', erreur);
        alert('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
        afficherSection('accueil');
    }
}

async function effectuerAnalyse(texte, titre, auteur) {
    // Simulation de progression
    const messages = [
        'Lecture du manuscrit...',
        'Identification des personnages...',
        'Analyse de la chronologie...',
        'Détection des incohérences...',
        'Analyse du style...',
        'Évaluation du rythme...',
        'Génération de la Bible du roman...',
        'Production du rapport final...'
    ];

    for (let i = 0; i < messages.length; i++) {
        document.getElementById('loader-message').textContent = messages[i];
        document.getElementById('progress').style.width = ((i + 1) / messages.length * 100) + '%';
        await attendre(400);
    }

    // Effectuer la vraie analyse
    const analyzer = new ManuscriptAnalyzer(texte, titre, auteur);
    return await analyzer.analyserComplet();
}

function demarrerProgression() {
    document.getElementById('progress').style.width = '0%';
}

function attendre(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== AFFICHAGE DES RÉSULTATS =====
function afficherResultats(resultats) {
    // En-tête
    document.getElementById('manuscrit-info').innerHTML = `
        <strong>${resultats.metadata.titre}</strong> 
        par ${resultats.metadata.auteur} • 
        ${resultats.statistiques.nbMots.toLocaleString('fr-FR')} mots • 
        ${resultats.statistiques.tempsLectureMin} min de lecture
    `;

    // Remplir chaque onglet
    remplirDiagnostic(resultats);
    remplirBible(resultats);
    remplirCoherence(resultats);
    remplirRepetitions(resultats);
    remplirRythme(resultats);
    remplirPersonnages(resultats);
    remplirEmotion(resultats);
    remplirStyle(resultats);
    remplirPlanRevision(resultats);
}

// ===== ONGLET 1 : DIAGNOSTIC =====
function remplirDiagnostic(r) {
    const scores = r.scores;
    const html = `
        <h3>📊 Diagnostic général</h3>
        <p style="margin-bottom: 20px; color: var(--gray);">
            Vue d'ensemble de votre manuscrit sur 8 critères essentiels
        </p>

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

        <div class="alert alert-info" style="margin-top: 30px;">
            <div class="alert-title">⭐ Potentiel après révision</div>
            <p>Score estimé : <strong>${scores.potentiel}/10</strong></p>
            <p>Votre manuscrit possède une base ${parseFloat(scores.coherence) > 5 ? 'solide' : 'à consolider'}. 
               Les axes d'amélioration principaux sont identifiés dans les onglets suivants.</p>
        </div>

        <h4 style="margin-top: 30px;">📋 Résumé statistique</h4>
        <ul class="issue-list">
            <li class="issue-item info">
                <strong>${r.statistiques.nbMots.toLocaleString('fr-FR')}</strong> mots au total
            </li>
            <li class="issue-item info">
                <strong>${r.statistiques.nbPhrases}</strong> phrases
            </li>
            <li class="issue-item info">
                Longueur moyenne des phrases : <strong>${r.statistiques.longueurMoyennePhrase} mots</strong>
            </li>
            <li class="issue-item info">
                <strong>${r.statistiques.nbDialogues}</strong> répliques de dialogue détectées
            </li>
            <li class="issue-item info">
                <strong>${r.statistiques.nbChapitres}</strong> chapitre(s) détecté(s)
            </li>
        </ul>
    `;
    document.getElementById('tab-diagnostic').innerHTML = html;
}

function genererCarteScore(label, score) {
    const valeur = parseFloat(score);
    const classe = valeur >= 7 ? 'high' : (valeur >= 5 ? 'medium' : 'low');
    return `
        <div class="score-card ${classe}">
            <div class="score-label">${label}</div>
            <div class="score-value ${classe}">${score}/10</div>
        </div>
    `;
}

// ===== ONGLET 2 : BIBLE DU ROMAN =====
function remplirBible(r) {
    const bible = r.bible;
    let html = `
        <h3>👤 Bible du roman</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Mémoire automatique de votre roman. Cette Bible sera enrichie à chaque nouveau chapitre.
        </p>

        <h4>📚 Résumé</h4>
        <p>${bible.resumeGlobal}</p>

        <h4 style="margin-top: 30px;">🎭 Personnages</h4>
    `;

    if (bible.personnages.length === 0) {
        html += '<p style="color: var(--gray);">Aucun personnage clairement identifié.</p>';
    } else {
        bible.personnages.forEach(p => {
            html += `
                <div class="character-card">
                    <div class="character-name">${p.nom} ${p.role === 'principal' ? '⭐' : ''}</div>
                    <div class="character-info">
                        <div><strong>Rôle :</strong> ${p.role}</div>
                        <div><strong>Apparitions :</strong> ${p.apparitions} fois</div>
                        <div><strong>Première apparition :</strong> ${p.premiereApparition}</div>
                    </div>
                    ${p.description ? `<p style="margin-top: 10px;"><em>"${p.description}"</em></p>` : ''}
                    ${p.relations.length > 0 ? `
                        <div style="margin-top: 10px;">
                            <strong>Relations détectées :</strong>
                            <ul>
                                ${p.relations.map(rel => `<li>${rel.type}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }

    // Lieux
    if (bible.lieux.length > 0) {
        html += `
            <h4 style="margin-top: 30px;">📍 Lieux mentionnés</h4>
            <ul class="issue-list">
                ${bible.lieux.map(l => `
                    <li class="issue-item info">
                        <strong>${l.nom}</strong> — ${l.mentions} mention(s)
                    </li>
                `).join('')}
            </ul>
        `;
    }

    // Chronologie
    if (bible.chronologie.length > 0) {
        html += `
            <h4 style="margin-top: 30px;">📅 Chronologie détectée</h4>
            <div class="timeline">
                ${bible.chronologie.map(c => `
                    <div class="timeline-item">
                        <strong>${c.evenement}</strong> 
                        <span style="color: var(--gray);">— ${c.mentions} mention(s)</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Informations incertaines
    if (bible.informationsIncertaines.length > 0) {
        html += `
            <h4 style="margin-top: 30px;">⚠️ Informations à vérifier</h4>
            ${bible.informationsIncertaines.map(inc => `
                <div class="alert alert-warning">
                    <div class="alert-title">${inc.element}</div>
                    <p>${inc.details}</p>
                </div>
            `).join('')}
        `;
    }

    document.getElementById('tab-bible').innerHTML = html;
}

// ===== ONGLET 3 : COHÉRENCE =====
function remplirCoherence(r) {
    const coherence = r.coherence;
    const recos = r.recommandations.problemes.filter(p => p.type === 'coherence');
    
    let html = `
        <h3>🔴 Analyse de cohérence</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Détection des contradictions, incohérences et ambiguïtés dans votre manuscrit
        </p>
    `;

    // Problèmes détectés
    if (recos.length > 0) {
        recos.forEach(p => {
            html += genererCarteProbleme(p);
        });
    } else {
        html += `
            <div class="alert alert-success">
                <div class="alert-title">✅ Aucune incohérence majeure détectée</div>
                <p>Votre manuscrit semble cohérent sur les points analysés automatiquement.</p>
            </div>
        `;
    }

    // Aliases potentiels
    if (coherence.aliasesPotentiels.length > 0) {
        html += `
            <div class="alert alert-warning" style="margin-top: 20px;">
                <div class="alert-title">🔀 Changements de nom détectés</div>
                <p>Les noms suivants pourraient désigner un même personnage : 
                   <strong>${coherence.aliasesPotentiels.join(', ')}</strong></p>
                <p>Vérifiez si ces changements sont intentionnels et justifiés dans le récit.</p>
            </div>
        `;
    }

    // Âges mentionnés
    if (coherence.agesMentionnes.length > 0) {
        html += `
            <h4 style="margin-top: 30px;">🎂 Âges mentionnés dans le texte</h4>
            <ul class="issue-list">
                ${coherence.agesMentionnes.slice(0, 10).map(age => `
                    <li class="issue-item info">${age}</li>
                `).join('')}
            </ul>
            ${coherence.agesMentionnes.length > 5 ? `
                <div class="alert alert-info" style="margin-top: 15px;">
                    <p>Plusieurs âges sont mentionnés. Vérifiez qu'ils respectent la chronologie de votre récit.</p>
                </div>
            ` : ''}
        `;
    }

    // Dates
    if (coherence.dates.length > 0) {
        html += `
            <h4 style="margin-top: 30px;">📅 Dates détectées</h4>
            <p>${coherence.dates.join(' • ')}</p>
        `;
    }

    document.getElementById('tab-coherence').innerHTML = html;
}

function genererCarteProbleme(p) {
    const classe = p.gravite === 'rouge' ? 'danger' : 
                  p.gravite === 'orange' ? 'warning' : 'info';
    const icone = p.gravite === 'rouge' ? '🔴' : 
                  p.gravite === 'orange' ? '🟠' : '🔵';
    
    return `
        <div class="alert alert-${classe}">
            <div class="alert-title">${icone} ${p.titre}</div>
            <p>${p.description}</p>
            ${p.pourquoi ? `
                <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong style="color: var(--accent);">Pourquoi c'est un problème :</strong><br>
                    ${p.pourquoi}
                </div>
            ` : ''}
            ${p.solutions && p.solutions.length > 0 ? `
                <div style="margin-top: 10px;">
                    <strong>💡 Solutions possibles :</strong>
                    <ul style="margin-top: 5px; margin-left: 20px;">
                        ${p.solutions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// ===== ONGLET 4 : RÉPÉTITIONS =====
function remplirRepetitions(r) {
    const reps = r.repetitions;
    let html = `
        <h3>🔁 Analyse des répétitions</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Détection des mots et idées répétés qui peuvent alourdir votre texte
        </p>
    `;

    // Problèmes d'idées répétées
    if (reps.ideesRepetees.length > 0) {
        html += `<h4>💡 Idées ou thèmes répétés</h4>`;
        reps.ideesRepetees.forEach(idee => {
            html += `
                <div class="alert alert-warning">
                    <div class="alert-title">🔁 ${idee.theme}</div>
                    <p>Cette idée apparaît <strong>${idee.occurrences} fois</strong> dans votre manuscrit.</p>
                    <p style="margin-top: 8px;"><em>Exemples : "${idee.exemples.join('", "')}"</em></p>
                    <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 10px;">
                        <strong style="color: var(--accent);">Recommandation :</strong><br>
                        Conservez une mention détaillée et transformez les autres en scènes courtes ou supprimez-les.
                    </div>
                </div>
            `;
        });
    }

    // Mots répétés
    if (reps.motsRepetes.length > 0) {
        html += `
            <h4 style="margin-top: 30px;">📝 Mots répétés (5+ occurrences)</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                ${reps.motsRepetes.map(m => `
                    <div class="issue-item info">
                        <strong>${m.mot}</strong> — ${m.occurrences} fois
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (reps.ideesRepetees.length === 0 && reps.motsRepetes.length === 0) {
        html += `
            <div class="alert alert-success">
                <div class="alert-title">✅ Bon niveau de variété</div>
                <p>Peu de répétitions problématiques détectées.</p>
            </div>
        `;
    }

    document.getElementById('tab-repetitions').innerHTML = html;
}

// ===== ONGLET 5 : RYTHME =====
function remplirRythme(r) {
    const rythme = r.rythme;
    const recos = r.recommandations.problemes.filter(p => p.type === 'rythme');
    
    let html = `
        <h3>📈 Analyse du rythme</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Évaluation de la dynamique narrative de votre manuscrit
        </p>

        <div class="score-grid">
            <div class="score-card">
                <div class="score-label">Dialogues</div>
                <div class="score-value">${rythme.ratioDialogues}%</div>
            </div>
            <div class="score-card">
                <div class="score-label">Descriptions</div>
                <div class="score-value">${rythme.ratioDescription}%</div>
            </div>
            <div class="score-card">
                <div class="score-label">Action</div>
                <div class="score-value">${rythme.ratioAction}%</div>
            </div>
            <div class="score-card">
                <div class="score-label">Phrases/paragraphe</div>
                <div class="score-value">${rythme.longueurMoyenneParagraphe}</div>
            </div>
        </div>
    `;

    // Problèmes
    if (recos.length > 0) {
        recos.forEach(p => {
            html += genererCarteProbleme(p);
        });
    }

    // Recommandations positives
    html += `
        <h4 style="margin-top: 30px;">💡 Recommandations sur le rythme</h4>
        <div class="alert alert-info">
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Alternez les passages narratifs avec des scènes dialoguées</li>
                <li>Créez des respirations entre les moments de tension</li>
                <li>Identifiez les moments forts et donnez-leur plus d'espace</li>
                <li>Supprimez les détails qui n'apportent rien à l'histoire</li>
                <li>Utilisez des phrases courtes pour les moments d'action</li>
                <li>Utilisez des phrases plus longues pour les descriptions</li>
            </ul>
        </div>
    `;

    document.getElementById('tab-rythme').innerHTML = html;
}

// ===== ONGLET 6 : PERSONNAGES =====
function remplirPersonnages(r) {
    const personnages = r.personnages;
    let html = `
        <h3>🎭 Analyse des personnages</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Identification et caractérisation des personnages de votre récit
        </p>
    `;

    if (personnages.length === 0) {
        html += '<p style="color: var(--gray);">Aucun personnage clairement identifié.</p>';
    } else {
        personnages.forEach(p => {
            const role = p.occurrences > 20 ? 'Personnage principal' : 
                        p.occurrences > 8 ? 'Personnage secondaire' : 'Personnage tertiaire';
            html += `
                <div class="character-card">
                    <div class="character-name">${p.nom} ${p.occurrences > 20 ? '⭐' : ''}</div>
                    <div class="character-info">
                        <div><strong>Rôle :</strong> ${role}</div>
                        <div><strong>Apparitions :</strong> ${p.occurrences} fois</div>
                        <div><strong>Actions détectées :</strong> ${p.action}</div>
                    </div>
                    ${p.contexte ? `
                        <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px;">
                            <em>Contexte : "${p.contexte}"</em>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `
            <div class="alert alert-info" style="margin-top: 20px;">
                <div class="alert-title">💡 Pour des personnages plus vivants</div>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li>Donnez-leur un objectif clair</li>
                    <li>Créez des conflits internes et externes</li>
                    <li>Montrez leur évolution au fil du récit</li>
                    <li>Faites-les interagir par le dialogue</li>
                    <li>Exploitez leurs faiblesses comme leviers dramatiques</li>
                </ul>
            </div>
        `;
    }

    document.getElementById('tab-personnages').innerHTML = html;
}

// ===== ONGLET 7 : ÉMOTION =====
function remplirEmotion(r) {
    const emotions = r.emotion;
    let html = `
        <h3>❤️ Analyse émotionnelle</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Cartographie des émotions présentes dans votre récit
        </p>

        <div style="margin: 20px 0;">
            ${Object.entries(emotions).map(([emotion, data]) => `
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong>${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</strong>
                        <span>${data.intensite}%</span>
                    </div>
                    <div style="background: var(--light); height: 25px; border-radius: 4px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, var(--accent), var(--secondary)); 
                                    height: 100%; width: ${data.intensite}%; transition: width 1s ease;"></div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="alert alert-info">
            <div class="alert-title">💡 Conseils pour renforcer l'émotion</div>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Laissez du temps au lecteur pour ressentir chaque émotion</li>
                <li>Montrez les émotions par les gestes et les pensées, pas seulement par les mots</li>
                <li>Créez des contrastes émotionnels (joie après tristesse, espoir après désespoir)</li>
                <li>Ne vous précipitez pas vers la fin d'une scène émotionnelle</li>
                <li>Utilisez les silences et les non-dits</li>
            </ul>
        </div>
    `;

    document.getElementById('tab-emotion').innerHTML = html;
}

// ===== ONGLET 8 : STYLE =====
function remplirStyle(r) {
    const style = r.style;
    let html = `
        <h3>✍️ Analyse du style</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Caractéristiques de votre voix d'auteur
        </p>

        <div class="score-grid">
            <div class="score-card">
                <div class="score-label">Longueur moyenne phrase</div>
                <div class="score-value">${style.longueurMoyenne}</div>
            </div>
            <div class="score-card">
                <div class="score-label">Variabilité</div>
                <div class="score-value">±${style.variabilite}</div>
            </div>
            <div class="score-card">
                <div class="score-label">Phrases longues (>30 mots)</div>
                <div class="score-value">${style.phrasesLongues}</div>
            </div>
            <div class="score-card">
                <div class="score-label">Phrases courtes (<8 mots)</div>
                <div class="score-value">${style.phrasesCourtes}</div>
            </div>
        </div>

        <h4 style="margin-top: 30px;">📊 Temps verbal dominant</h4>
        <p>Vous écrivez principalement au <strong>${style.tempsDominant}</strong>.</p>

        ${style.tics.length > 0 ? `
            <h4 style="margin-top: 30px;">⚠️ Tics d'écriture détectés</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                ${style.tics.map(t => `
                    <div class="issue-item warning">
                        <strong>${t.mot}</strong> — ${t.occurrences} fois
                    </div>
                `).join('')}
            </div>
            <div class="alert alert-info" style="margin-top: 15px;">
                <p>Les tics d'écriture ne sont pas des fautes, mais les réduire apporte souvent plus de fluidité.</p>
            </div>
        ` : ''}

        <div class="alert alert-success" style="margin-top: 20px;">
            <div class="alert-title">🌟 Votre voix d'auteur</div>
            <p>Cette analyse identifie votre style personnel. Les recommandations respecteront votre voix unique 
               plutôt que de la transformer en style générique.</p>
        </div>
    `;

    document.getElementById('tab-style').innerHTML = html;
}

// ===== ONGLET 9 : PLAN DE RÉVISION =====
function remplirPlanRevision(r) {
    const recos = r.recommandations;
    let html = `
        <h3>🎯 Plan de révision personnalisé</h3>
        <p style="color: var(--gray); margin-bottom: 20px;">
            Actions prioritaires pour améliorer votre manuscrit
        </p>

        <h4>🔴 Problèmes prioritaires</h4>
    `;

    const rouges = recos.problemes.filter(p => p.gravite === 'rouge');
    if (rouges.length > 0) {
        rouges.forEach((p, i) => {
            html += `
                <div class="alert alert-danger">
                    <div class="alert-title">Priorité ${i + 1} : ${p.titre}</div>
                    <p>${p.description}</p>
                    ${p.solutions && p.solutions.length > 0 ? `
                        <details style="margin-top: 10px;">
                            <summary style="cursor: pointer; color: var(--accent);">Voir les solutions</summary>
                            <ul style="margin-top: 10px; margin-left: 20px;">
                                ${p.solutions.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </details>
                    ` : ''}
                </div>
            `;
        });
    } else {
        html += '<p style="color: var(--gray);">Aucun problème majeur détecté. Excellent !</p>';
    }

    html += '<h4 style="margin-top: 30px;">🟠 Problèmes à améliorer</h4>';
    const oranges = recos.problemes.filter(p => p.gravite === 'orange');
    if (oranges.length > 0) {
        oranges.forEach(p => {
            html += `
                <div class="alert alert-warning">
                    <div class="alert-title">${p.titre}</div>
                    <p>${p.description}</p>
                </div>
            `;
        });
    } else {
        html += '<p style="color: var(--gray);">Aucun problème intermédiaire.</p>';
    }

    html += `
        <h4 style="margin-top: 30px;">🟢 Vos forces</h4>
        <div class="alert alert-success">
            <ul style="margin-left: 20px; margin-top: 10px;">
                ${recos.forces.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>

        <h4 style="margin-top: 30px;">📋 Plan d'action complet</h4>
        <ol style="margin-left: 20px; line-height: 2;">
            ${recos.planRevision.map(action => `<li>${action}</li>`).join('')}
        </ol>

        <div class="alert alert-info" style="margin-top: 30px;">
            <div class="alert-title">💡 Méthode recommandée</div>
            <p>Travaillez dans cet ordre :</p>
            <ol style="margin-left: 20px; margin-top: 10px;">
                <li>Commencez par les problèmes rouges (structure et cohérence)</li>
                <li>Puis les problèmes oranges (style et rythme)</li>
                <li>Enfin, peaufinez les dialogues et les descriptions</li>
                <li>Faites une relecture à voix haute pour vérifier la fluidité</li>
                <li>Soumettez votre manuscrit à un bêta-lecteur</li>
            </ol>
        </div>
    `;

    document.getElementById('tab-plan').innerHTML = html;
}

// ===== NAVIGATION =====
function basculerTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function afficherSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

// ===== EXPORT =====
function exporterRapport() {
    window.print();
}

// ===== NOUVEAU MANUSCRIT =====
function recommencer() {
    if (confirm('Voulez-vous vraiment analyser un nouveau manuscrit ? Les résultats actuels seront perdus.')) {
        document.getElementById('texte-direct').value = '';
        document.getElementById('manuscrit').value = '';
        document.getElementById('file-name').textContent = 'Choisir un fichier (TXT, DOC, DOCX, PDF)';
        manuscritActuel = null;
        resultatsActuels = null;
        afficherSection('accueil');
    }
}

// ===== PAIEMENT =====
function selectionnerPlan(planId) {
    const plan = CONFIG.PRICING[planId];
    if (!plan) return;
    
    const confirmation = confirm(
        `Vous allez être redirigé vers le paiement pour :\n\n` +
        `${plan.nom} - ${plan.prix}€\n\n` +
        `${plan.description}\n\n` +
        `Continuer ?`
    );
    
    if (confirmation) {
        // Ici, intégrer Stripe, PayPal, ou votre solution de paiement
        alert('🚧 Intégration paiement à configurer.\n\nDans la version finale, vous serez redirigé vers Stripe/PayPal.\n\nPlan sélectionné : ' + plan.nom);
        
        // Exemple d'intégration Stripe (à décommenter et configurer)
        // window.location.href = `https://buy.stripe.com/votre-lien-stripe?plan=${planId}`;
    }
}

// ===== UTILITAIRES =====
function genererRapportTexte(r) {
    // Pour export PDF ou copie
    let texte = `RAPPORT MANUSCRIT PRO\n`;
    texte += `=====================\n\n`;
    texte += `Manuscrit : ${r.metadata.titre}\n`;
    texte += `Auteur : ${r.metadata.auteur}\n`;
    texte += `Date : ${new Date(r.metadata.dateAnalyse).toLocaleDateString('fr-FR')}\n\n`;
    texte += `STATISTIQUES\n`;
    texte += `- Mots : ${r.statistiques.nbMots}\n`;
    texte += `- Chapitres : ${r.statistiques.nbChapitres}\n\n`;
    texte += `SCORES\n`;
    Object.entries(r.scores).forEach(([k, v]) => {
        texte += `- ${k} : ${v}/10\n`;
    });
    return texte;
}
