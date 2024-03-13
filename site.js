(() => {
  const ROLE_COUNTS = {
    7: [5, 0, 1, 1], // Townsfolk, Outsider, Minion, Demon
    8: [5, 1, 1, 1],
    9: [5, 2, 1, 1],
    10: [7, 0, 2, 1],
    11: [7, 1, 2, 1],
    12: [7, 2, 2, 1],
    13: [9, 0, 3, 1],
    14: [9, 1, 3, 1],
    15: [9, 2, 3, 1],
  };
  const SETS = {
    tb: {
      roles: {
        townsfolk: [
          'Washerwoman',
          'Librarian',
          'Investigator',
          'Chef',
          'Empath',
          'Fortune Teller',
          'Undertaker',
          'Monk',
          'Ravenkeeper',
          'Virgin',
          'Slayer',
          'Soldier',
          'Mayor',
        ],
        outsider: ['Butler', 'Drunk', 'Recluse', 'Saint'],
        minion: ['Poisoner', 'Spy', 'Scarlet Woman', 'Baron'],
        demon: ['Imp'],
      },
      markers: {
        Washerwoman: ['Townsfolk', 'Decoy'],
        Librarian: ['Outsider', 'Decoy'],
        Investigator: ['Minion', 'Decoy'],
        'Fortune Teller': ['Decoy'],
        Undertaker: ['Executed'],
        Monk: ['Protected'],
        Virgin: ['Used'],
        Slayer: ['Used'],
        Butler: ['Master'],
        Poisoner: ['Poisoned'],
        'Scarlet Woman': ['Demon'],
        Imp: ['Die', '2nd', '3rd', '4th'],
        '': ['Drunk', '+'],
      },
      firstNight: [
        '(Minion info)',
        '(Demon info)',
        'Poisoner',
        'Spy',
        'Washerwoman',
        'Librarian',
        'Investigator',
        'Chef',
        'Empath',
        'Fortune Teller',
        'Butler',
      ],
      otherNights: [
        'Poisoner',
        'Monk',
        'Spy',
        'Scarlet Woman',
        'Imp',
        'Ravenkeeper',
        'Undertaker',
        'Empath',
        'Fortune Teller',
        'Butler',
      ],
    },
    bmr: {
      roles: {
        townsfolk: [
          'Grandmother',
          'Sailor',
          'Chambermaid',
          'Exorcist',
          'Innkeeper',
          'Gambler',
          'Gossip',
          'Courtier',
          'Professor',
          'Minstrel',
          'Tea Lady',
          'Pacifist',
          'Fool',
        ],
        outsider: ['Tinker', 'Moonchild', 'Goon', 'Lunatic'],
        minion: ['Godfather', "Devil's Advocate", 'Assassin', 'Mastermind'],
        demon: ['Zombuul', 'Pukka', 'Shabaloth', 'Po'],
      },
      markers: {
        Grandmother: ['Grandchild', 'Die'],
        Sailor: ['Drunk'],
        Exorcist: ['Chosen'],
        Innkeeper: ['Protected 1', 'Protected 2', 'Drunk'],
        Gambler: ['Die'],
        Gossip: ['Die'],
        Courtier: ['Used', 'Drunk 1', 'Drunk 2', 'Drunk 3'],
        Professor: ['Used', 'Alive'],
        Minstrel: ['Everyone Drunk'],
        'Tea Lady': ['Protected 1', 'Protected 2'],
        Fool: ['Used'],
        Tinker: ['Die'],
        Moonchild: ['Die'],
        Goon: ['Drunk'],
        Godfather: ['Died Today', 'Die'],
        "Devil's Advocate": ['Chosen'],
        Assassin: ['Used', 'Die'],
        Zombuul: ['No Death Today', 'Die'],
        Pukka: ['Poisoned', 'Die'],
        Shabaloth: ['Die 1', 'Die 2', 'Alive'],
        Po: ['Die 1', 'Die 2', 'Die 3', 'Attack 3'],
        '': ['Lunatic', '+'],
      },
      firstNight: [
        '(Minion info)',
        '(Lunatic info)',
        '(Demon info)',
        'Sailor',
        'Courtier',
        'Godfather',
        "Devil's Advocate",
        '(Lunatic action)',
        'Pukka',
        'Grandmother',
        'Chambermaid',
        'Goon',
      ],
      otherNights: [
        'Minstrel',
        'Sailor',
        'Innkeeper',
        'Courtier',
        'Gambler',
        "Devil's Advocate",
        '(Lunatic action)',
        'Exorcist',
        'Zombuul',
        'Pukka',
        'Shabaloth',
        'Po',
        'Assassin',
        'Godfather',
        'Professor',
        'Gossip',
        'Tinker',
        'Moonchild',
        'Grandmother',
        'Chambermaid',
        'Goon',
      ],
    },
  };

  const DATA_MODEL = {
    set: 'tb',
    players: [],
    prompter: {
      active: false,
      notInPlay: [null, null, null],
      roleInfo: null,
      message: null,
    },
  };
  const PLAYER_MODEL = {
    status: 'alive', // alive, dead_vote, dead_no_vote
    role: null,
    group: null,
    markers: [],
    addedMarker: null, // Temporary, reset every time
  };

  document.addEventListener('alpine:init', () => {
    Alpine.data('botc', function () {
      return {
        data: this.$persist(JSON.parse(JSON.stringify(DATA_MODEL))),

        // Computed
        get set() {
          return SETS[this.data.set];
        },
        get roleCounts() {
          return ROLE_COUNTS[this.data.players.length].join('-');
        },
        get alivePlayerCount() {
          return this.data.players.filter((p) => p.status === 'alive').length;
        },
        get requiredVoteCount() {
          return Math.ceil(this.alivePlayerCount / 2);
        },
        get chosenRoles() {
          return new Set(this.data.players.map((p) => p.role));
        },
        get firstNightOrder() {
          const chosenRoles = this.chosenRoles;
          return this.set.firstNight.filter((r) => chosenRoles.has(r) || r.startsWith('('));
        },
        get otherNightsOrder() {
          const chosenRoles = this.chosenRoles;
          return this.set.otherNights.filter((r) => chosenRoles.has(r));
        },
        get availableMarkers() {
          const markers = this.set.markers;
          const chosenRoles = this.chosenRoles;
          return Object.keys(markers)
            .filter((r) => r === '' || chosenRoles.has(r))
            .flatMap((r) => {
              let shortRole = r.split(' ')[0].substring(0, 5);
              return markers[r].map((m) => (r ? shortRole + ' - ' : '') + m);
            });
        },
        get townsfolkNotInPlay() {
          const chosenRoles = this.chosenRoles;
          return this.set.roles.townsfolk.filter((r) => !chosenRoles.has(r));
        },

        // Method
        addMarker(player) {
          const marker = player.addedMarker;
          player.addedMarker = null;
          if (!marker) return;

          // If exists, remove
          if (player.markers.indexOf(marker) >= 0) {
            this.removeMarker(player, marker);
            return;
          }

          // Add marker
          if (marker !== '+') {
            this.data.players.forEach((p) => {
              p.markers = p.markers.filter((m) => m !== marker);
            });
          }
          player.markers.push(marker);
        },
        removeMarker(player, marker) {
          player.markers = player.markers.filter((m) => m !== marker);
        },
        changeRole(player) {
          // Record group
          const roles = this.set.roles;
          player.group = null;
          for (let group in roles) {
            if (roles[group].indexOf(player.role) >= 0) {
              player.group = group;
              break;
            }
          }

          // Clean up invalid markers
          const availableMarkers = new Set(this.availableMarkers);
          this.data.players.forEach((p) => {
            p.markers = p.markers.filter((m) => availableMarkers.has(m));
          });

          // Clean up invalid not-in-play prompt
          const chosenRoles = this.chosenRoles;
          this.data.prompter.notInPlay = this.data.prompter.notInPlay.map((r) => (chosenRoles.has(r) ? null : r));
        },
        reset() {
          if (!confirm('End game and reset all data?')) return;
          this.data = JSON.parse(JSON.stringify(DATA_MODEL));
          window.location.reload();
        },
        togglePrompter() {
          this.data.prompter.active = !this.data.prompter.active;
        },
        promptMinion() {
          const demonIndex = this.data.players.findIndex((p) => p.group === 'demon') + 1;
          if (!demonIndex) {
            alert('There is no Demon!');
            return;
          }
          this.data.prompter.message = `Demon:\n\n${demonIndex}`;
        },
        promptDemon() {
          const minionIndexes = this.data.players
            .map((p, i) => (p.group === 'minion' ? i + 1 : null))
            .filter(Boolean)
            .join(', ');
          if (!minionIndexes) {
            alert('There are no minions!');
            return;
          }
          const notInPlay = this.data.prompter.notInPlay.filter(Boolean).join('\n');
          if (!notInPlay) {
            alert('Not in play roles are not set!');
            return;
          }
          this.data.prompter.message = `Minions:\n\n${minionIndexes}\n\nNot in play:\n\n${notInPlay}`;
        },
        promptRole() {
          const role = this.data.prompter.roleInfo;
          if (!role) {
            alert('Role is not set!');
            return;
          }
          this.data.prompter.message = `Role:\n\n${role}`;
        },
        promptCustom() {
          const message = prompt('Write your message:');
          if (!message) return;
          this.data.prompter.message = message;
        },
        clearPrompt() {
          this.data.prompter.message = null;
        },

        // Initialization
        init() {
          if (this.data.players.length === 0) {
            let playerCount;
            while (!(playerCount >= 7 && playerCount <= 15)) {
              playerCount = Math.floor(prompt('How many players? (7-15)'));
            }
            const playerModelJson = JSON.stringify(PLAYER_MODEL);
            for (let i = 0; i < playerCount; i++) {
              this.data.players.push(JSON.parse(playerModelJson));
            }
          }
        },
      };
    });
  });
})();
