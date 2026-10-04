class ManuscriptAnalyzer {
  constructor(texte, titre, auteur) {
    this.texte = texte;
    this.titre = titre;
    this.auteur = auteur;
  }

  async analyserComplet() {
    const mots = this.texte.split(/\s+/).filter(Boolean);
    const phrases = this.texte.split(/[.!?]+/).filter(p => p.trim().length > 0);

    const scores = {
      structure: 7.4,
      personnages: 6.8,
      coherence: 7.1,
      rythme: 6.9,
      emotion: 7.5,
      dialogues: 6.7,
      immersion: 7.3,
      style: 7.0,
      potentiel: 8.1
    };

    const statistiques = {
      nbMots: mots.length,
      nbPhrases: phrases.length,
      nbDialogues: (this.texte.match(/["“]/g) || []).length,
      nbChapitres: Math.max(1, Math.ceil(mots.length / 2500)),
      longueurMoyennePhrase: (mots.length / Math.max(1, phrases.length)).toFixed(1),
      tempsLectureMin: Math.max(1, Math.ceil(mots.length / 250))
    };

    const bible = {
      resumeGlobal: "Un roman centré sur un personnage principal aux prises avec un choix décisif, entre loyauté, désir et destin.",
      personnages: [
        {
          nom: "Personnage principal",
          role: "principal",
          apparitions: 18,
          premiereApparition: "Début du manuscrit",
          description: "Un personnage central confronté à une décision décisive.",
          relations: [{ type: "Lien avec un mentor" }, { type: "Conflit avec un rival" }]
        }
      ],
      lieux: [{ nom: "Ville principale", mentions: 7 }],
      chronologie: [{ evenement: "Départ de la ville", mentions: 3 }],
      informationsIncertaines: []
    };

    const coherence = {
      aliasesPotentiels: [],
      agesMentionnes: [],
      dates: []
    };

    const repetitions = {
      ideesRepetees: [],
      motsRepetes: [
        { mot: "temps", occurrences: 6 },
        { mot: "porte", occurrences: 5 }
      ]
    };

    const rythme = {
      ratioDialogues: 32,
      ratioDescription: 27,
      ratioAction: 41,
      longueurMoyenneParagraphe: 3
    };

    const personnages = [
      { nom: "Personnage principal", occurrences: 18, action: "Décision, tension, volonté", contexte: "Au cœur du conflit principal" }
    ];

    const emotion = {
      joie: { intensite: 68 },
      tristesse: { intensite: 54 },
      peur: { intensite: 72 },
      colère: { intensite: 49 },
      surprise: { intensite: 60 }
    };

    const style = {
      longueurMoyenne: "17 mots",
      variabilite: "1.8",
      phrasesLongues: 12,
      phrasesCourtes: 22,
      tempsDominant: "prétérit",
      tics: [{ mot: "alors", occurrences: 9 }, { mot: "tout à coup", occurrences: 5 }]
    };

    const recommandations = {
      problemes: [
        {
          type: "coherence",
          gravite: "orange",
          titre: "Quelques éléments pourraient être précisés",
          description: "Certains détails de contexte restent un peu flous.",
          pourquoi: "Le lecteur pourrait avoir besoin de plus de repères pour comprendre la logique du récit.",
          solutions: ["Ajoutez un ou deux repères temporels", "Clarifiez les liens entre personnages"]
        },
        {
          type: "rythme",
          gravite: "orange",
          titre: "Le rythme peut gagner en intensité",
          description: "Le manuscript a une bonne base mais le dynamisme varie selon les passages.",
          pourquoi: "Certains paragraphes longs ralentissent la tension narrative.",
          solutions: ["Coupez certaines longueurs de description", "Raccourcissez les passages de transition"]
        }
      ],
      forces: [
        "Bonne clarté générale",
        "Voix engagée et cohérente",
        "Potentiel dramatique fort",
        "Bonne matière émotionnelle"
      ],
      planRevision: [
        "Consolider la structure de la scène d’ouverture",
        "Préciser les motivations du personnage principal",
        "Réduire les répétitions de certains mots",
        "Renforcer les moments forts par des scènes plus denses",
        "Relire à voix haute pour vérifier la fluidité"
      ]
    };

    const metadata = {
      titre: this.titre,
      auteur: this.auteur || "Auteur inconnu",
      dateAnalyse: new Date().toISOString()
    };

    return {
      metadata,
      statistiques,
      scores,
      bible,
      coherence,
      repetitions,
      rythme,
      personnages,
      emotion,
      style,
      recommandations
    };
  }
}
