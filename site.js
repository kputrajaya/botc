(() => {
  const ROLE_COUNTS = {
    5: [3, 0, 1, 1], // Townsfolk, Outsider, Minion, Demon
    6: [3, 1, 1, 1],
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
  // Source: docs.google.com/spreadsheets/d/1eJkBC6rF-VU6J0h0KJvyiXjs2HLl6Yjzw9jfVYHOW34
  const ORDERS = {
    firstNight: [
      'Philosopher',
      'Kazali',
      'Alchemist',
      'Poppy Grower',
      'Yaggababble',
      'Magician',
      '(Minion info)',
      'Snitch',
      'Lunatic',
      '(Demon info)',
      'King',
      'Sailor',
      'Marionette',
      'Engineer',
      'Preacher',
      "Lil' Monsta",
      'Lleech',
      'Poisoner',
      'Widow',
      'Courtier',
      'Snake Charmer',
      'Godfather',
      "Devil's Advocate",
      'Evil Twin',
      'Witch',
      'Cerenovus',
      'Fearmonger',
      'Harpy',
      'Mezepheles',
      'Pukka',
      'Pixie',
      'Huntsman',
      'Damsel',
      'Amnesiac',
      'Washerwoman',
      'Librarian',
      'Investigator',
      'Chef',
      'Empath',
      'Fortune Teller',
      'Butler',
      'Grandmother',
      'Clockmaker',
      'Dreamer',
      'Seamstress',
      'Steward',
      'Knight',
      'Noble',
      'Balloonist',
      'Shugenja',
      'Village Idiot',
      'Bounty Hunter',
      'Nightwatchman',
      'Cult Leader',
      'Spy',
      'Ogre',
      'High Priestess',
      'General',
      'Chambermaid',
      'Mathematician',
    ],
    otherNights: [
      'Philosopher',
      'Poppy Grower',
      'Sailor',
      'Engineer',
      'Preacher',
      'Poisoner',
      'Courtier',
      'Inkeeper',
      'Gambler',
      'Snake Charmer',
      'Monk',
      "Devil's Advocate",
      'Witch',
      'Cerenovus',
      'Pit-Hag',
      'Fearmonger',
      'Harpy',
      'Mezepheles',
      'Scarlet Woman',
      'Summoner',
      'Lunatic',
      'Exorcist',
      'Lycanthrope',
      'Legion',
      'Imp',
      'Zombuul',
      'Pukka',
      'Shabaloth',
      'Po',
      'Fang Gu',
      'No Dashii',
      'Vortox',
      'Vigormortis',
      'Ojo',
      'Al-Hadikhia',
      'Lleech',
      "Lil' Monsta",
      'Yaggababble',
      'Kazali',
      'Assassin',
      'Godfather',
      'Gossip',
      'Sweetheart',
      'Banshee',
      'Professor',
      'Choirboy',
      'Huntsman',
      'Damsel',
      'Grandmother',
      'Ravenkeeper',
      'Empath',
      'Balloonist',
      'King',
      'Bounty Hunter',
      'Nightwatchman',
      'Acrobat',
      'Hatter',
      'Barber',
      'Sage',
      'Amnesiac',
      'Farmer',
      'Tinker',
      'Moonchild',
      'Fortune Teller',
      'Undertaker',
      'Dreamer',
      'Flowergirl',
      'Town Crier',
      'Oracle',
      'Seamstress',
      'Juggler',
      'Village Idiot',
      'Cult Leader',
      'Butler',
      'Spy',
      'High Priestess',
      'General',
      'Chambermaid',
      'Mathematician',
    ],
  };
  // Source: docs.google.com/spreadsheets/d/17-45-5I1HvUGvtU_LbkgPwIiQxzlP_kH
  const MARKERS = {
    Artist: ['No Ability'],
    Assassin: ['Dead', 'No Ability'],
    Barber: ['Haircuts Tonight'],
    Butler: ['Master'],
    Cerenovus: ['Mad'],
    Courtier: ['Drunk 1', 'Drunk 2', 'Drunk 3', 'No Ability'],
    "Devil's Advocate": ['Survives Execution'],
    'Evil Twin': ['Twin'],
    Exorcist: ['Chosen'],
    'Fang Gu': ['Once', 'Dead'],
    Flowergirl: ['Demon Voted', 'Demon Not Voted'],
    Fool: ['No Ability'],
    'Fortune Teller': ['Red Herring'],
    Gambler: ['Dead'],
    Godfather: ['Died Today', 'Dead'],
    Goon: ['Drunk'],
    Gossip: ['Dead'],
    Grandmother: ['Grandchild', 'Dead'],
    Imp: ['Dead', 'Imp 2', 'Imp 3'],
    Innkeeper: ['Safe 1', 'Safe 2', 'Drunk'],
    Investigator: ['Minion', 'Wrong'],
    Juggler: ['Correct 1', 'Correct 2', 'Correct 3', 'Correct 4', 'Correct 5'],
    Librarian: ['Outsider', 'Wrong'],
    Lunatic: ['Chosen 1', 'Chosen 2', 'Chosen 3'],
    Minstrel: ['Everyone Is Drunk'],
    Mathematician: ['Abnormal 1', 'Abnormal 2', 'Abnormal 3', 'Abnormal 4', 'Abnormal 5'],
    Monk: ['Safe'],
    Moonchild: ['Dead'],
    'No Dashii': ['Dead', 'Poisoned 1', 'Poisoned 2'],
    Philosopher: ['Is The Philosopher', 'Drunk'],
    Po: ['Dead 1', 'Dead 2', 'Dead 3', 'Three Attacks'],
    Poisoner: ['Poisoned'],
    Professor: ['Alive', 'No Ability'],
    Pukka: ['Poisoned 1', 'Poisoned 2', 'Dead'],
    Sage: ['Demon', 'Wrong'],
    Sailor: ['Drunk'],
    'Scarlet Woman': ['Is The Demon'],
    Seamstress: ['No Ability'],
    Shabaloth: ['Dead 1', 'Dead 2', 'Alive'],
    Slayer: ['No Ability'],
    'Snake Charmer': ['Poisoned'],
    Sweetheart: ['Drunk'],
    'Tea Lady': ['Cannot Die 1', 'Cannot Die 2'],
    Tinker: ['Dead'],
    'Town Crier': ['Minion Nominated', 'Minions Not Nominated'],
    Undertaker: ['Died Today'],
    Vigormortis: ['Dead', 'Poisoned 1', 'Poisoned 2', 'Poisoned 3', 'Has Ability 1', 'Has Ability 2', 'Has Ability 3'],
    Virgin: ['No Ability'],
    Vortox: ['Dead'],
    Washerwoman: ['Townsfolk', 'Wrong'],
    Zombuul: ['Died Today', 'Dead'],
    '': ['Is The Drunk', 'Good*', 'Evil*'],
  };
  const SETS = {
    tb: {
      name: 'Trouble Brewing',
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
        outsider: ['Butler', 'Recluse', 'Saint'], // + Drunk
        minion: ['Poisoner', 'Spy', 'Scarlet Woman', 'Baron'],
        demon: ['Imp'],
      },
    },
    bmr: {
      name: 'Bad Moon Rising',
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
    },
    sv: {
      name: 'Sects & Violets',
      roles: {
        townsfolk: [
          'Clockmaker',
          'Dreamer',
          'Snake Charmer',
          'Mathematician',
          'Flowergirl',
          'Town Crier',
          'Oracle',
          'Savant',
          'Seamstress',
          'Philosopher',
          'Artist',
          'Juggler',
          'Sage',
        ],
        outsider: ['Mutant', 'Sweetheart', 'Barber', 'Klutz'],
        minion: ['Evil Twin', 'Witch', 'Cerenovus', 'Pit-Hag'],
        demon: ['Fang Gu', 'Vigormortis', 'No Dashii', 'Vortox'],
      },
    },
    ngj: {
      name: 'No Greater Joy',
      roles: {
        townsfolk: ['Clockmaker', 'Investigator', 'Empath', 'Chambermaid', 'Artist', 'Sage'],
        outsider: ['Klutz'], // + Drunk
        minion: ['Scarlet Woman', 'Baron'],
        demon: ['Imp'],
      },
    },
    oti: {
      name: 'On Thin Ice',
      roles: {
        townsfolk: ['Seamstress', 'Philosopher', 'Professor', 'Artist', 'Slayer', 'Virgin'],
        outsider: ['Klutz', 'Moonchild'],
        minion: ['Evil Twin', 'Mastermind'],
        demon: ['Pukka'],
      },
    },
  };

  const DATA_MODEL = {
    set: null,
    players: [],
    sharer: {
      active: false,
      show: false,
      index: 0,
    },
    prompter: {
      active: false,
      message: null,
    },
  };
  const PLAYER_MODEL = {
    initial: '',
    status: 'alive', // alive, dead_vote, dead_no_vote
    role: null,
    group: null,
    markers: [],
    addedMarker: null, // Temporary, resets every time
  };

  document.addEventListener('alpine:init', () => {
    const notyf = new Notyf({
      ripple: false,
      position: { x: 'center' },
    });
    const getParams = () => {
      const params = {};
      const search = window.location.search;
      if (search) {
        search
          .substring(1)
          .split('&')
          .forEach((param) => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value).replace(/\+/g, ' ').replace(/\|/g, '\n');
          });
      }
      return params;
    };
    const copyText = async (text) => {
      // Copy using execCommand
      const el = document.createElement('textarea');
      el.style.opacity = 0;
      document.body.prepend(el);
      el.value = text;
      el.focus();
      el.select();
      const result = document.execCommand && document.execCommand('copy');
      el.remove();
      if (result === true) return true;

      // Copy using navigator.clipboard
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch {}
      }

      return false;
    };

    Alpine.data('botc', function () {
      return {
        data: this.$persist(JSON.parse(JSON.stringify(DATA_MODEL))),
        subKey: this.$persist(null),
        isPub: true, // Whether the page is a publisher (Grimoire) or subscriber (Town Square)

        // Computed
        get set() {
          return SETS[this.data.set || Object.keys(SETS)[0]];
        },
        get roleCounts() {
          return (ROLE_COUNTS[this.data.players.length] || []).join(' - ');
        },
        get alivePlayerCount() {
          return this.data.players.filter((p) => p.status === 'alive').length;
        },
        get requiredVoteCount() {
          return Math.ceil(this.alivePlayerCount / 2);
        },
        get setRoles() {
          const roles = this.set.roles;
          return new Set(
            Object.keys(roles)
              .map((g) => roles[g])
              .flat()
          );
        },
        get chosenRoles() {
          return new Set(this.data.players.map((p) => p.role).filter(Boolean));
        },
        get firstNightOrder() {
          const setRoles = this.setRoles;
          const chosenRoles = this.chosenRoles;
          return ORDERS.firstNight
            .filter((r) => setRoles.has(r) || r.startsWith('('))
            .map((r) => ({ name: r, chosen: chosenRoles.has(r) || r.startsWith('(') }));
        },
        get otherNightsOrder() {
          const setRoles = this.setRoles;
          const chosenRoles = this.chosenRoles;
          return ORDERS.otherNights
            .filter((r) => setRoles.has(r))
            .map((r) => ({ name: r, chosen: chosenRoles.has(r) }));
        },
        get availableMarkers() {
          const chosenRoles = this.chosenRoles;
          return Object.keys(MARKERS)
            .filter((r) => r === '' || chosenRoles.has(r))
            .flatMap((r) => {
              let shortRole = r
                .replace(/[^A-Za-z]/g, ' ')
                .split(' ')[0]
                .substring(0, 5)
                .toUpperCase();
              return MARKERS[r].map((m) => (r ? shortRole + ' · ' : '') + m);
            });
        },
        get playerMidIndex() {
          return Math.ceil(this.data.players.length / 2);
        },

        // Method
        setInitial(player) {
          let initial = prompt('Set an initial to be displayed [A-Z]?', player.initial || '');
          if (initial === null) return;

          initial = initial.trim().toUpperCase();
          if (!initial || /^[A-Z]$/.test(initial)) {
            player.initial = initial;
          } else {
            notyf.error('Invalid initial!');
          }
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
        },
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
          if (marker[marker.length - 1] !== '*') {
            this.data.players.forEach((p) => {
              p.markers = p.markers.filter((m) => m !== marker);
            });
          }
          player.markers.push(marker);
        },
        removeMarker(player, marker) {
          player.markers = player.markers.filter((m) => m !== marker);
        },
        formatMarker(text) {
          return text.replace(/[\s\*]/g, '');
        },
        shuffleRoles() {
          if (!confirm('Shuffle player roles?')) return;

          const players = this.data.players;

          // Pick a random index and swap it with the current one
          let cur = players.length;
          let ran;
          while (cur > 0) {
            ran = Math.floor(Math.random() * cur);
            cur--;
            [players[cur].role, players[ran].role] = [players[ran].role, players[cur].role];
          }

          // Refresh groups and markers
          players.forEach((p) => {
            this.changeRole(p);
          });
        },
        toggleSharer() {
          // Validate and prompt action
          const roles = this.data.players.map((p) => p.role).filter(Boolean);
          if (roles.length < this.data.players.length) {
            notyf.error('Fill all roles first!');
            return;
          }
          if (new Set(roles).size < this.data.players.length) {
            notyf.error('Roles are not unique!');
            return;
          }
          if (!confirm('Start sharing roles to players?')) return;
          this.data.sharer.active = true;
        },
        sharerNext() {
          if (this.data.sharer.show) {
            this.data.sharer.index++;
            this.data.sharer.show = false;
          } else if (this.data.sharer.index >= this.data.players.length) {
            if (!confirm('Are you really the Storyteller?')) return;
            this.data.sharer.active = false;
            this.data.sharer.show = false;
            this.data.sharer.index = 0;
          } else {
            this.data.sharer.show = true;
          }
        },
        togglePrompter() {
          this.data.prompter.active = !this.data.prompter.active;
        },
        promptText(message) {
          this.data.prompter.message = message;
        },
        promptCustom() {
          const message = prompt('What is your message?');
          if (!message) return;
          this.data.prompter.message = message;
        },
        promptClear() {
          this.data.prompter.message = null;
        },
        copySquareLink() {
          copyText(`${window.location.href}?k=${this.subKey}`);
          notyf.success('Link copied!');
        },
        reset() {
          const response = prompt('Reset game? Type "y" to continue.') || '';
          if (response.trim().toLowerCase() !== 'y') return;

          this.data = JSON.parse(JSON.stringify(DATA_MODEL));
          window.location.reload();
        },

        // Initialization
        init() {
          const connect = (subKey) => {
            const ws = new WebSocket('wss://pubsub.h.kvn.pt/');
            if (this.isPub) {
              ws.onopen = () => {
                console.log('Sending data (initial)');
                ws.send(JSON.stringify({ action: 'pub', key: subKey, data: this.data }));
              };
              this.$watch('data', (value) => {
                console.log('Sending data');
                ws.send(JSON.stringify({ action: 'pub', key: subKey, data: value }));
              });
            } else {
              ws.onopen = () => {
                console.log('Subscribing to:', subKey);
                ws.send(JSON.stringify({ action: 'sub', key: subKey }));
              };
              ws.onmessage = (event) => {
                console.log('Received data');
                this.data = JSON.parse(event.data);
              };
            }
            ws.onerror = function (err) {
              console.error('Socket error:', err.message);
              ws.close();
            };
            ws.onclose = (e) => {
              console.log('Socket closed:', e.reason);
              setTimeout(() => connect(subKey), 1000);
            };
          };

          // Connect as subscriber if Town Square
          const params = getParams();
          if (params.k) {
            this.isPub = false;
            connect('botc:' + params.k);
            return;
          }

          if (!this.data.players.length || !this.data.set) {
            // Ask for player count
            const minPlayer = 5;
            const maxPlayer = 15;
            let promptText = `How many players? (${minPlayer}-${maxPlayer})`;
            let playerCount;
            while (!(playerCount >= minPlayer && playerCount <= maxPlayer)) {
              playerCount = Math.floor(prompt(promptText));
            }
            this.data.players = [];
            const playerModelJson = JSON.stringify(PLAYER_MODEL);
            for (let i = 0; i < playerCount; i++) {
              this.data.players.push(JSON.parse(playerModelJson));
            }

            // Ask for edition
            const keys = Object.keys(SETS);
            const options = keys.map((k, i) => `${i + 1}. ${SETS[k].name}`);
            promptText = `Which edition? (1-${keys.length})\n${options.join('\n')}`;
            let edition;
            while (!(edition >= 1 && edition <= keys.length)) {
              edition = Math.floor(prompt(promptText));
            }
            this.data.set = keys[edition - 1];

            // Randomize roles
            const roleGroups = Object.values(this.set.roles);
            const roleCounts = ROLE_COUNTS[this.data.players.length];
            let lastPlayerIndex = 0;
            roleCounts.forEach((roleCount, i) => {
              const selectedRoles = roleGroups[i]
                .map((role, index) => ({ role, index }))
                .sort(() => Math.random() - 0.5)
                .slice(0, roleCount)
                .sort((a, b) => a.index - b.index)
                .map((item) => item.role);
              selectedRoles.forEach((r, j) => {
                const player = this.data.players[lastPlayerIndex + j];
                player.role = r;
                this.changeRole(player);
              });
              lastPlayerIndex += roleCount;
            });
          }

          this.subKey = this.subKey || Math.random().toString(36).substring(2);
          connect('botc:' + this.subKey);
        },
      };
    });
  });
})();
