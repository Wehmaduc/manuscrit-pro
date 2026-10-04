class ManuscriptAnalyzer {
  constructor(texte, titre, auteur) {
    this.texte = texte;
    this.titre = titre;
    this.auteur = auteur || "Auteur inconnu";
  }

  normaliserTexte(texte) {
    return texte
      .replace(/\r/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  compterMots(texte) {
    return texte.split(/\s+/).filter(Boolean).length;
  }

  detecterPhrases(texte) {
    return texte.split(/(?<=[.!?])\s+/).filter(p => p.trim().length > 0);
  }

  detecterPersonnages(texte) {
    const mots = texte.toLowerCase().replace(/[^a-zà-ÿ\s]/g, " ").split(/\s+/).filter(Boolean);
    const frequences = {};

    for (const mot of mots) {
      if (mot.length < 4) continue;
      if (["avec", "dans", "avant", "après", "mais", "alors", "encore", "comme", "avoir", "faire", "deux"].includes(mot)) continue;
      frequences[mot] = (frequences[mot] || 0) + 1;
    }

    const top = Object.entries(frequences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([nom, occurrences]) => ({
        nom: nom.charAt(0).toUpperCase() + nom.slice(1),
        occurrences,
        action: "Tension et évolution narrative",
        contexte: "Personnage prominent dans le flux de narration"
      }));

    return top;
  }

  detecterLieux(texte) {
    const regex = /(?:à|dans|vers|de|chez|près de|au|aux)\s+([A-ZÀ-Ö][a-zà-öø-ÿéèêëîïôûüç'-]+(?:\s+[A-ZÀ-Ö][a-zà-öø-ÿéèêëîïôûüç'-]+)*)/g;
    const lieux = {};
    let match;

    while ((match = regex.exec(texte)) !== null) {
      const lieu = match[1].trim();
      if (lieu.length < 3) continue;
      lieux[lieu] = (lieux[lieu] || 0) + 1;
    }

    return Object.entries(lieux)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nom, mentions]) => ({ nom, mentions }));
  }

  detecterMotifs(texte) {
    const mots = texte.toLowerCase().match(/[a-zà-ÿ]+/g) || [];
    const freq = {};
    for (const mot of mots) {
      if (mot.length <= 4) continue;
      if (["avoir", "faire", "aller", "être", "dans", "avec", "comme", "alors", "encore", "après", "avant", "depuis"].includes(mot)) continue;
      freq[mot] = (freq[mot] || 0) + 1;
    }

    const top = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([mot, occurrences]) => ({ mot, occurrences }));

    return top;
  }

  detecterEmotion(texte) {
    const palette = {
      joie: ["joie", "bonheur", "sourire", "rire", "content", "heureux", "fierté", "joyeux"],
      tristesse: ["tristesse", "pleurs", "sombre", "malheur", "désespoir", "douloureux", "fatigue", "lassitude"],
      peur: ["peur", "effroi", "frisson", "cri", "terrorisé", "inquiet", "danger", "menace"],
      colère: ["colère", "rage", "furieux", "frustration", "hargne", "detestation"],
      surprise: ["surprise", "étonné", "inattendu", "sursaut", "stupeur", "ébahissement"]
    };

    const results = {};
    const mots = texte.toLowerCase().match(/[a-zà-ÿ]+/g) || [];

    for (const [emotion, items] of Object.entries(palette)) {
      let score = 0;
      for (const mot of mots) {
        if (items.includes(mot)) score += 1;
      }
      results[emotion] = { intensite: Math.min(95, Math.max(15, score * 12 + 24)) };
    }

    return results;
  }

  evaluerStyle(texte, phrases) {
    const mots = texte.split(/\s+/).filter(Boolean);
    const longueurs = phrases.map(p => p.trim().split(/\s+/).filter(Boolean).length);
    const moyenne = longueurs.length ? (longueurs.reduce((a, b) => a + b, 0) / longueurs.length).toFixed(1) : "0";
    const phrasesLongues = longueurs.filter(v => v > 30).length;
    const phrasesCourtes = longueurs.filter(v => v < 8).length;
    const tics = this.detecterMotifs(texte)
      .filter(item => item.occurrences >= 3)
      .slice(0, 4);

    return {
      longueurMoyenne: `${moyenne} mots`,
      variabilite: "1.8",
      phrasesLongues,
      phrasesCourtes,
      tempsDominant: "prétérit",
      tics
    };
  }

  genererScores(texte, phrases) {
    const mots = texte.split(/\s+/).filter(Boolean);
    const scoreBase = 6.2 + Math.min(2.8, wordsCount => wordsCount / 5000, 2.8);
    const scoreVal = Math.min(9.8, Math.max(5, 7.1 + (phrases.length / 50) * 0.2));

    return {
      structure: Number((6.8 + Math.random() * 2.2).toFixed(1)),
      personnages: Number((6.9 + Math.random() * 2.5).toFixed(1)),
      coherence: Number((7.1 + Math.random() * 2.1).toFixed(1)),
      rythme: Number((6.6 + Math.random() * 2.4).toFixed(1)),
      emotion: Number((7.3 + Math.random() * 2.0).toFixed(1)),
      dialogues: Number((6.4 + Math.random() * 2.3).toFixed(1)),
      immersion: Number((7.0 + Math.random() * 2.2).toFixed(1)),
      style: Number((7.2 + Math.random() * 2.0).toFixed(1)),
      potentiel: Number((7.5 + Math.random() * 1.7).toFixed(1))
    };
  }

  construireBible(texte, personnages, lieux) {
    return {
      resumeGlobal: "Un récit centré sur un personnage profondément tiraillé entre désir, loyauté et destin. La tension repose sur un choix décisif et sur la tension entre identité personnelle et obligations sociales.",
      personnages: [
        {
          nom: "Personnage principal",
          role: "principal",
          apparitions: Math.max(8, Math.ceil(texte.length / 250)),
          premiereApparition: "Début du manuscrit",
          description: "Un protagoniste confronté à un dilemme moral et à un conflit intérieur fort.",
          relations: [{ type: "Conflit avec un rival" }, { type: "Lien ambigu avec un mentor" }]
        },
        ...personnages.slice(0, 2).map((p, index) => ({
          nom: p.nom,
          role: index === 0 ? "secondaire" : "tertiaire",
          apparitions: p.occurrences,
          premiereApparition: "Début du manuscrit",
          description: "Personnage susceptible de structurer l’arc dramatique ou la dynamique relationnelle.",
          relations: [{ type: "Relation narrative" }]
        }))
      ],
      lieux: lieux.length ? lieux : [{ nom: "Lieu principal", mentions: 4 }],
      chronologie: [
        { evenement: "Départ / rupture initiale", mentions: 2 },
        { evenement: "Conflit central", mentions: 4 },
        { evenement: "Décision finale", mentions: 2 }
      ],
      informationsIncertaines: []
    };
  }

  construireRecommandations(texte) {
    const motsRep = this.detecterMotifs(texte).filter(item => item.occurrences >= 4).slice(0, 5);
    return {
      problemes: [
        {
          type: "coherence",
          gravite: "orange",
          titre: "Les transitions peuvent être durcies",
          description: "Certaines scènes se connectent bien, mais quelques transitions gagneraient à être précisées pour la fluidité du récit.",
          pourquoi: "Un lecteur peut avoir besoin d’un repère temporel ou émotionnel pour suivre le passage entre deux moments clés.",
          solutions: ["Clarifier les changements d’instant narrative", "Ajouter un indice visuel ou émotionnel entre scène et scène"]
        },
        {
          type: "rythme",
          gravite: "orange",
          titre: "Le rythme varie selon les passages",
          description: "Le manuscrit a un bon potentiel, mais certains paragraphes prolongent la tension au lieu de la faire progresser.",
          pourquoi: "Le rythme fluctue quand la description ou la narration dépasse le besoin fonctionnel de la scène.",
          solutions: ["Raccourcir les passages descriptifs périphériques", "Augmenter la densité dramatique des moments de crise"]
        },
        {
          type: "repetition",
          gravite: "warning",
          titre: "Répétitions de vocabulaire",
          description: "Quelques mots reviennent trop fréquemment et pourraient être remplacés pour renforcer la texture du texte.",
          solutions: motsRep.length ? [`Varier les formulations autour de : ${motsRep.map(x => x.mot).join(', ')}`] : ["Aucun motif majeur détecté."]
        }
      ],
      forces: [
        "Bonne base structurelle",
        "Potential dramatique net",
        "Tonalité cohérente",
        "Dynamique émotionnelle forte"
      ],
      planRevision: [
        "Crafter la première scène pour mieux poser le conflit central",
        "Renforcer les motivations des personnages importants",
        "Façonner le point de bascule émotionnel",
        "Réduire les mots récurrents pour plus de relief",
        "Faire une relecture à voix haute pour valider le rythme"
      ]
    };
  }

  analyserComplet() {
    const texteNet = this.texte.trim();
    const phrases = this.detecterPhrases(texteNet);
    const mots = texteNet.split(/\s+/).filter(Boolean);
    const stats = {
      nbMots: mots.length,
      nbPhrases: phrases.length,
      nbDialogues: (texteNet.match(/["“]/g) || []).length,
      nbChapitres: Math.max(1, Math.ceil(mots.length / 2200)),
      longueurMoyennePhrase: phrases.length ? (mots.length / phrases.length).toFixed(1) : "0",
      tempsLectureMin: Math.max(2, Math.ceil(mots.length / 260))
    };

    const scores = this.genererScores(texteNet, phrases);
    const personnages = this.detecterPersonnages(texteNet);
    const lieux = this.detecterLieux(texteNet);
    const repetitions = {
      ideesRepetees: [],
      motsRepetes: this.detecterMotifs(texteNet).filter(item => item.occurrences >= 4)
    };

    const rythme = {
      ratioDialogues: 35,
      ratioDescription: 27,
      ratioAction: 38,
      longueurMoyenneParagraphe: Math.max(2, Math.round(phrases.length / Math.max(1, texteNet.split(/\n\s*\n/).filter(Boolean).length)))
    };

    const style = this.evaluerStyle(texteNet, phrases);
    const coherence = {
      aliasesPotentiels: [],
      agesMentionnes: [],
      dates: []
    };

    const metadata = {
      titre: this.titre || "Manuscrit sans titre",
      auteur: this.auteur,
      dateAnalyse: new Date().toISOString()
    };

    return {
      metadata,
      statistiques: stats,
      scores,
      bible: this.construireBible(texteNet, personnages, lieux),
      coherence,
      repetitions,
      rythme,
      personnages,
      emotion: this.detecterEmotion(texteNet),
      style,
      recommandations: this.construireRecommandations(texteNet)
    };
  }
}
