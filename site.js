(() => {
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
  const CHAR_COUNT = {
    7: [5, 0, 1, 1],
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
        outsider: ['Butler', 'Saint', 'Recluse'],
        minion: ['Poisoner', 'Spy', 'Baron', 'Scarlet Woman'],
        demon: ['Imp'],
      },
      markers: {
        '': ['+', 'Drunk', 'Demon'],
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
      },
      firstNight: [
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
  };

  document.addEventListener('alpine:init', () => {
    Alpine.data('botc', function () {
      return {
        data: this.$persist(JSON.parse(JSON.stringify(DATA_MODEL))),

        // Computed
        get set() {
          return SETS[this.data.set];
        },
        get charCounts() {
          return CHAR_COUNT[this.data.players.length].join('-');
        },
        get alivePlayers() {
          return this.data.players.filter((p) => p.status === 'alive').length;
        },
        get requiredVotes() {
          return Math.ceil(this.alivePlayers / 2);
        },
        get chosenRoles() {
          return new Set(this.data.players.map((p) => p.role));
        },
        get firstNightOrder() {
          const chosenRoles = this.chosenRoles;
          return this.set.firstNight.filter((r) => chosenRoles.has(r));
        },
        get otherNightsOrder() {
          const chosenRoles = this.chosenRoles;
          return this.set.otherNights.filter((r) => chosenRoles.has(r));
        },
        get availableMarkers() {
          const chosenRoles = this.chosenRoles;
          return Object.keys(this.set.markers)
            .filter((r) => r === '' || chosenRoles.has(r))
            .flatMap((r) => this.set.markers[r].map((m) => (r ? r + ' - ' : '') + m));
        },
        get townsfolkNotInPlay() {
          const chosenRoles = this.chosenRoles;
          return this.set.roles.townsfolk.filter((r) => !chosenRoles.has(r));
        },

        // Method
        addMarker(player) {
          const marker = player.addedMarker;
          player.addedMarker = null;
          if (!marker || player.markers.indexOf(marker) >= 0) return;

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
          player.group = null;
          for (let group in this.set.roles) {
            if (this.set.roles[group].indexOf(player.role) >= 0) {
              player.group = group;
              break;
            }
          }

          // Clean up invalid markers
          const availableMarkers = new Set(this.availableMarkers);
          this.data.players.forEach((p) => {
            p.markers = p.markers.filter((m) => availableMarkers.has(m));
          });

          // Clean up invalid not-in-play
          this.data.prompter.notInPlay = this.data.prompter.notInPlay.map((r) => (this.chosenRoles.has(r) ? null : r));
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
            alert('Demon not found!');
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
            alert('Minions not found!');
            return;
          }
          const notInPlay = this.data.prompter.notInPlay.filter(Boolean).join('\n');
          if (!notInPlay) {
            alert('Not in play characters is not set!');
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
            let playerCount = 0;
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
