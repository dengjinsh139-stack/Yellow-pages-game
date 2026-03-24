// 游戏世界数据 - 游戏类型名词清单
const GAME_WORLD_DATA = {
    categories: [
        {
            id: 'rpg',
            name: 'RPG · 角色扮演',
            fullName: 'Role-Playing Game',
            nameCn: '角色扮演游戏',
            description: '玩家扮演虚拟世界中的角色，通过完成任务、战斗、探索来推进剧情',
            icon: '🎭',
            color: '#9c27b0',
            subCategories: [
                {
                    id: 'arpg',
                    name: 'ARPG',
                    fullName: 'Action RPG',
                    nameCn: '动作角色扮演',
                    description: '结合动作战斗与角色扮演元素',
                    games: [
                        {
                            name: '黑暗之魂3',
                            nameEn: 'Dark Souls III',
                            developer: 'FromSoftware',
                            developerUrl: 'https://www.fromsoftware.jp/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bs411D7R6',
                            cgUrl: 'https://www.bilibili.com/video/BV1es411D73e',
                            ostUrl: 'https://www.bilibili.com/video/BV1Wx41187RS'
                        },
                        {
                            name: '巫师3：狂猎',
                            nameEn: 'The Witcher 3: Wild Hunt',
                            developer: 'CD Projekt Red',
                            developerUrl: 'https://www.cdprojekt.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1fx411A7mu',
                            cgUrl: 'https://www.bilibili.com/video/BV1gx411A7gg',
                            ostUrl: 'https://www.bilibili.com/video/BV1Us411D7E4'
                        },
                        {
                            name: '艾尔登法环',
                            nameEn: 'Elden Ring',
                            developer: 'FromSoftware',
                            developerUrl: 'https://www.fromsoftware.jp/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1jY411G7sW',
                            cgUrl: 'https://www.bilibili.com/video/BV1x64y1a7Bf',
                            ostUrl: 'https://www.bilibili.com/video/BV1NS4y1F7X3'
                        }
                    ]
                },
                {
                    id: 'srpg',
                    name: 'SRPG',
                    fullName: 'Strategy RPG',
                    nameCn: '策略角色扮演',
                    description: '结合策略战棋与角色扮演元素',
                    games: [
                        {
                            name: '火焰纹章：风花雪月',
                            nameEn: 'Fire Emblem: Three Houses',
                            developer: 'Intelligent Systems',
                            developerUrl: 'https://www.intsys.co.jp/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1At411n77y',
                            cgUrl: 'https://www.bilibili.com/video/BV1it411n7Mc',
                            ostUrl: 'https://www.bilibili.com/video/BV1B4411z7ET'
                        },
                        {
                            name: '最终幻想战略版',
                            nameEn: 'Final Fantasy Tactics',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Bx411N7oc',
                            cgUrl: 'https://www.bilibili.com/video/BV1px411N7sQ',
                            ostUrl: 'https://www.bilibili.com/video/BV1Ex411P7NZ'
                        },
                        {
                            name: 'XCOM 2',
                            nameEn: 'XCOM 2',
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Us411X7Bg',
                            cgUrl: 'https://www.bilibili.com/video/BV1es411X7Hd',
                            ostUrl: 'https://www.bilibili.com/video/BV1Us411X7Du'
                        }
                    ]
                },
                {
                    id: 'jrpg',
                    name: 'JRPG',
                    fullName: 'Japanese RPG',
                    nameCn: '日式角色扮演',
                    description: '源自日本的传统回合制RPG风格',
                    games: [
                        {
                            name: '最终幻想VII 重制版',
                            nameEn: 'Final Fantasy VII Remake',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1j7411w7xP',
                            cgUrl: 'https://www.bilibili.com/video/BV1X4411x7Sj',
                            ostUrl: 'https://www.bilibili.com/video/BV1A7411w7SC'
                        },
                        {
                            name: '女神异闻录5 皇家版',
                            nameEn: 'Persona 5 Royal',
                            developer: 'Atlus',
                            developerUrl: 'https://www.atlus.co.jp/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1y4411M7yT',
                            cgUrl: 'https://www.bilibili.com/video/BV1nx411a7nj',
                            ostUrl: 'https://www.bilibili.com/video/BV1tx411a7S7'
                        },
                        {
                            name: '勇者斗恶龙XI',
                            nameEn: 'Dragon Quest XI',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411x7MJ',
                            cgUrl: 'https://www.bilibili.com/video/BV1vx411x7hQ',
                            ostUrl: 'https://www.bilibili.com/video/BV1ix411x7Cu'
                        }
                    ]
                },
                {
                    id: 'mmorpg',
                    name: 'MMORPG',
                    fullName: 'Massively Multiplayer Online RPG',
                    nameCn: '大型多人在线角色扮演',
                    description: '支持数千玩家同时在线的RPG',
                    games: [
                        {
                            name: '魔兽世界',
                            nameEn: 'World of Warcraft',
                            developer: 'Blizzard Entertainment',
                            developerUrl: 'https://www.blizzard.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411w7ZX',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411w7ZX',
                            ostUrl: 'https://www.bilibili.com/video/BV1wx411G7tg'
                        },
                        {
                            name: '最终幻想XIV',
                            nameEn: 'Final Fantasy XIV',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1xW411j7B9',
                            cgUrl: 'https://www.bilibili.com/video/BV1xW411j7B9',
                            ostUrl: 'https://www.bilibili.com/video/BV1nx41137BF'
                        },
                        {
                            name: '原神',
                            nameEn: 'Genshin Impact',
                            developer: 'miHoYo',
                            developerUrl: 'https://www.mihoyo.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1At4y1q7Eu',
                            cgUrl: 'https://www.bilibili.com/video/BV1yp4y1x7SN',
                            ostUrl: 'https://www.bilibili.com/video/BV1D64y1f7ij'
                        }
                    ]
                }
            ]
        },
        {
            id: 'fps',
            name: 'FPS · 第一人称射击',
            fullName: 'First-Person Shooter',
            nameCn: '第一人称射击',
            description: '以第一人称视角进行的射击游戏',
            icon: '🎯',
            color: '#f44336',
            subCategories: [
                {
                    id: 'tactical-fps',
                    name: '战术射击',
                    fullName: 'Tactical FPS',
                    nameCn: '战术射击',
                    description: '强调团队配合与战术策略',
                    games: [
                        {
                            name: '反恐精英2',
                            nameEn: 'Counter-Strike 2',
                            developer: 'Valve',
                            developerUrl: 'https://www.valvesoftware.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1eu4y1C7ow',
                            cgUrl: 'https://www.bilibili.com/video/BV1zh4y1P7c3',
                            ostUrl: 'https://www.bilibili.com/video/BV1Xh411T7cL'
                        },
                        {
                            name: '彩虹六号：围攻',
                            nameEn: "Tom Clancy's Rainbow Six Siege",
                            developer: 'Ubisoft',
                            developerUrl: 'https://www.ubisoft.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Us411d7TV',
                            cgUrl: 'https://www.bilibili.com/video/BV1es411d7Xj',
                            ostUrl: 'https://www.bilibili.com/video/BV1Us411d7Ha'
                        },
                        {
                            name: 'Valorant',
                            nameEn: 'Valorant',
                            developer: 'Riot Games',
                            developerUrl: 'https://www.riotgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1ka4y1i7NR',
                            cgUrl: 'https://www.bilibili.com/video/BV1Q54y1D7GH',
                            ostUrl: 'https://www.bilibili.com/video/BV1HZ4y1s7jm'
                        }
                    ]
                },
                {
                    id: 'arena-fps',
                    name: '竞技场射击',
                    fullName: 'Arena FPS',
                    nameCn: '竞技场射击',
                    description: '快节奏、强调身法的射击对战',
                    games: [
                        {
                            name: '毁灭战士：永恒',
                            nameEn: 'DOOM Eternal',
                            developer: 'id Software',
                            developerUrl: 'https://www.idsoftware.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1CJ411x7Ve',
                            cgUrl: 'https://www.bilibili.com/video/BV1CJ411x7Ve',
                            ostUrl: 'https://www.bilibili.com/video/BV1nJ41187A4'
                        },
                        {
                            name: '雷神之锤：冠军',
                            nameEn: 'Quake Champions',
                            developer: 'id Software',
                            developerUrl: 'https://www.idsoftware.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Ex41187hC',
                            cgUrl: 'https://www.bilibili.com/video/BV1px41187hH',
                            ostUrl: 'https://www.bilibili.com/video/BV1tx41187Xr'
                        },
                        {
                            name: '虚幻竞技场',
                            nameEn: 'Unreal Tournament',
                            developer: 'Epic Games',
                            developerUrl: 'https://www.epicgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx41187Xs',
                            cgUrl: 'https://www.bilibili.com/video/BV1vx41187Cj',
                            ostUrl: 'https://www.bilibili.com/video/BV1ix41187Mo'
                        }
                    ]
                },
                {
                    id: 'battle-royale',
                    name: '大逃杀',
                    fullName: 'Battle Royale',
                    nameCn: '大逃杀',
                    description: '百人竞技，最后生存者获胜',
                    games: [
                        {
                            name: '绝地求生',
                            nameEn: 'PUBG: Battlegrounds',
                            developer: 'KRAFTON',
                            developerUrl: 'https://www.krafton.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1ex411x7vD',
                            cgUrl: 'https://www.bilibili.com/video/BV1xx411x7xS',
                            ostUrl: 'https://www.bilibili.com/video/BV1Jx411x7PM'
                        },
                        {
                            name: 'Apex英雄',
                            nameEn: 'Apex Legends',
                            developer: 'Respawn Entertainment',
                            developerUrl: 'https://www.respawn.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1nb411U7wT',
                            cgUrl: 'https://www.bilibili.com/video/BV1nb411U7wT',
                            ostUrl: 'https://www.bilibili.com/video/BV1Tb411U79K'
                        },
                        {
                            name: '使命召唤：战区',
                            nameEn: 'Call of Duty: Warzone',
                            developer: 'Infinity Ward',
                            developerUrl: 'https://www.infinityward.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1D7411s7ZK',
                            cgUrl: 'https://www.bilibili.com/video/BV1D7411s7ZK',
                            ostUrl: 'https://www.bilibili.com/video/BV1A7411s7Yc'
                        }
                    ]
                }
            ]
        },
        {
            id: 'slg',
            name: 'SLG · 策略模拟',
            fullName: 'Simulation Game',
            nameCn: '策略/模拟游戏',
            description: '强调策略规划、资源管理、模拟经营',
            icon: '⚔️',
            color: '#ff9800',
            subCategories: [
                {
                    id: 'rts',
                    name: 'RTS',
                    fullName: 'Real-Time Strategy',
                    nameCn: '即时战略',
                    description: '实时进行的战略对战游戏',
                    games: [
                        {
                            name: '星际争霸2',
                            nameEn: 'StarCraft II',
                            developer: 'Blizzard Entertainment',
                            developerUrl: 'https://www.blizzard.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411w7Rg',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411w7Rg',
                            ostUrl: 'https://www.bilibili.com/video/BV1wx411G7rY'
                        },
                        {
                            name: '帝国时代4',
                            nameEn: 'Age of Empires IV',
                            developer: 'Relic Entertainment',
                            developerUrl: 'https://www.relic.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1rL411G7Pe',
                            cgUrl: 'https://www.bilibili.com/video/BV1rL411G7Pe',
                            ostUrl: 'https://www.bilibili.com/video/BV1SL411G7uK'
                        },
                        {
                            name: '全面战争：三国',
                            nameEn: 'Total War: Three Kingdoms',
                            developer: 'Creative Assembly',
                            developerUrl: 'https://www.creative-assembly.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Vb411L7xW',
                            cgUrl: 'https://www.bilibili.com/video/BV1Vb411L7xW',
                            ostUrl: 'https://www.bilibili.com/video/BV1Sb411L7mY'
                        }
                    ]
                },
                {
                    id: 'turn-based',
                    name: '回合制策略',
                    fullName: 'Turn-Based Strategy',
                    nameCn: '回合制策略',
                    description: '轮流行动的深度策略游戏',
                    games: [
                        {
                            name: '文明6',
                            nameEn: "Sid Meier's Civilization VI",
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1xs411x7og',
                            cgUrl: 'https://www.bilibili.com/video/BV1xs411x7og',
                            ostUrl: 'https://www.bilibili.com/video/BV1Fs411x7iA'
                        },
                        {
                            name: 'XCOM 2',
                            nameEn: 'XCOM 2',
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Us411X7Bg',
                            cgUrl: 'https://www.bilibili.com/video/BV1es411X7Hd',
                            ostUrl: 'https://www.bilibili.com/video/BV1Us411X7Du'
                        },
                        {
                            name: '神界：原罪2',
                            nameEn: 'Divinity: Original Sin 2',
                            developer: 'Larian Studios',
                            developerUrl: 'https://www.larian.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Ax411x7rT',
                            cgUrl: 'https://www.bilibili.com/video/BV1Ax411x7rT',
                            ostUrl: 'https://www.bilibili.com/video/BV1sx411x7bc'
                        }
                    ]
                },
                {
                    id: '4x',
                    name: '4X策略',
                    fullName: '4X Strategy',
                    nameCn: '4X策略',
                    description: '探索、扩张、开发、征服',
                    games: [
                        {
                            name: '群星',
                            nameEn: 'Stellaris',
                            developer: 'Paradox Interactive',
                            developerUrl: 'https://www.paradoxinteractive.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1xs411x7oQ',
                            cgUrl: 'https://www.bilibili.com/video/BV1xs411x7oQ',
                            ostUrl: 'https://www.bilibili.com/video/BV1Fs411x7ih'
                        },
                        {
                            name: '无尽空间2',
                            nameEn: 'Endless Space 2',
                            developer: 'Amplitude Studios',
                            developerUrl: 'https://www.amplitude-studios.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Ax411x7WE',
                            cgUrl: 'https://www.bilibili.com/video/BV1Ax411x7WE',
                            ostUrl: 'https://www.bilibili.com/video/BV1sx411x7Qm'
                        },
                        {
                            name: '银河文明3',
                            nameEn: 'Galactic Civilizations III',
                            developer: 'Stardock',
                            developerUrl: 'https://www.stardock.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411x7oy',
                            cgUrl: 'https://www.bilibili.com/video/BV1vx411x7oT',
                            ostUrl: 'https://www.bilibili.com/video/BV1ix411x7oN'
                        }
                    ]
                }
            ]
        },
        {
            id: 'moba',
            name: 'MOBA · 多人在线竞技',
            fullName: 'Multiplayer Online Battle Arena',
            nameCn: '多人在线战术竞技',
            description: '两队对抗，推倒对方基地获胜',
            icon: '⚡',
            color: '#2196f3',
            subCategories: [
                {
                    id: 'classic-moba',
                    name: '经典MOBA',
                    fullName: 'Classic MOBA',
                    nameCn: '经典MOBA',
                    description: '传统三路对抗模式',
                    games: [
                        {
                            name: '英雄联盟',
                            nameEn: 'League of Legends',
                            developer: 'Riot Games',
                            developerUrl: 'https://www.riotgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1nx411G77t',
                            cgUrl: 'https://www.bilibili.com/video/BV1nx411G77t',
                            ostUrl: 'https://www.bilibili.com/video/BV1jx411G7FH'
                        },
                        {
                            name: 'DOTA2',
                            nameEn: 'Dota 2',
                            developer: 'Valve',
                            developerUrl: 'https://www.valvesoftware.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Gx411w7qw',
                            cgUrl: 'https://www.bilibili.com/video/BV1Gx411w7qw',
                            ostUrl: 'https://www.bilibili.com/video/BV1Ex411w7RB'
                        },
                        {
                            name: '风暴英雄',
                            nameEn: 'Heroes of the Storm',
                            developer: 'Blizzard Entertainment',
                            developerUrl: 'https://www.blizzard.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411w7Fe',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411w7Fe',
                            ostUrl: 'https://www.bilibili.com/video/BV1Vx411w7cy'
                        }
                    ]
                },
                {
                    id: 'mobile-moba',
                    name: '移动端MOBA',
                    fullName: 'Mobile MOBA',
                    nameCn: '移动端MOBA',
                    description: '专为移动设备优化的MOBA',
                    games: [
                        {
                            name: '王者荣耀',
                            nameEn: 'Honor of Kings',
                            developer: 'Tencent Games',
                            developerUrl: 'https://www.tencent.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411C7j8',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411C7j8',
                            ostUrl: 'https://www.bilibili.com/video/BV1fx411C7oG'
                        },
                        {
                            name: '英雄联盟手游',
                            nameEn: 'League of Legends: Wild Rift',
                            developer: 'Riot Games',
                            developerUrl: 'https://www.riotgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1iK4y1E7MB',
                            cgUrl: 'https://www.bilibili.com/video/BV1iK4y1E7MB',
                            ostUrl: 'https://www.bilibili.com/video/BV1eK4y1E7vY'
                        },
                        {
                            name: '无尽对决',
                            nameEn: 'Mobile Legends: Bang Bang',
                            developer: 'Moonton',
                            developerUrl: 'https://www.moonton.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411C7mY',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411C7mY',
                            ostUrl: 'https://www.bilibili.com/video/BV1vx411C7Ty'
                        }
                    ]
                }
            ]
        },
        {
            id: 'action',
            name: 'Action · 动作',
            fullName: 'Action Game',
            nameCn: '动作游戏',
            description: '强调操作技巧、反应速度的战斗游戏',
            icon: '👊',
            color: '#e91e63',
            subCategories: [
                {
                    id: 'hack-slash',
                    name: '砍杀类',
                    fullName: 'Hack and Slash',
                    nameCn: '砍杀类',
                    description: '爽快的连击与大规模战斗',
                    games: [
                        {
                            name: '战神',
                            nameEn: 'God of War',
                            developer: 'Santa Monica Studio',
                            developerUrl: 'https://www.santamonicastudio.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1nW411j7Xv',
                            cgUrl: 'https://www.bilibili.com/video/BV1nW411j7Xv',
                            ostUrl: 'https://www.bilibili.com/video/BV1zW411j7wS'
                        },
                        {
                            name: '鬼泣5',
                            nameEn: 'Devil May Cry 5',
                            developer: 'Capcom',
                            developerUrl: 'https://www.capcom.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Bt411d7Nt',
                            cgUrl: 'https://www.bilibili.com/video/BV1Bt411d7Nt',
                            ostUrl: 'https://www.bilibili.com/video/BV1Jt411d7A7'
                        },
                        {
                            name: '猎天使魔女2',
                            nameEn: 'Bayonetta 2',
                            developer: 'PlatinumGames',
                            developerUrl: 'https://www.platinumgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Dx411C7gJ',
                            cgUrl: 'https://www.bilibili.com/video/BV1Dx411C7gJ',
                            ostUrl: 'https://www.bilibili.com/video/BV1Tx411C7h6'
                        }
                    ]
                },
                {
                    id: 'platformer',
                    name: '平台跳跃',
                    fullName: 'Platformer',
                    nameCn: '平台跳跃',
                    description: '精准的跳跃与关卡探索',
                    games: [
                        {
                            name: '超级马里奥：奥德赛',
                            nameEn: 'Super Mario Odyssey',
                            developer: 'Nintendo',
                            developerUrl: 'https://www.nintendo.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1nx411u7vs',
                            cgUrl: 'https://www.bilibili.com/video/BV1nx411u7vs',
                            ostUrl: 'https://www.bilibili.com/video/BV1hx411u7AS'
                        },
                        {
                            name: '空洞骑士',
                            nameEn: 'Hollow Knight',
                            developer: 'Team Cherry',
                            developerUrl: 'https://www.teamcherry.com.au/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1vx411x7oy',
                            cgUrl: 'https://www.bilibili.com/video/BV1vx411x7oy',
                            ostUrl: 'https://www.bilibili.com/video/BV1Tx411x7SA'
                        },
                        {
                            name: '蔚蓝',
                            nameEn: 'Celeste',
                            developer: 'Maddy Makes Games',
                            developerUrl: 'http://www.maddymakesgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1kx411x7uc',
                            cgUrl: 'https://www.bilibili.com/video/BV1kx411x7uc',
                            ostUrl: 'https://www.bilibili.com/video/BV1bx411x7yw'
                        }
                    ]
                },
                {
                    id: 'stealth',
                    name: '潜行类',
                    fullName: 'Stealth Game',
                    nameCn: '潜行类',
                    description: '隐匿行动、策略潜入',
                    games: [
                        {
                            name: '合金装备5：幻痛',
                            nameEn: 'Metal Gear Solid V: The Phantom Pain',
                            developer: 'Kojima Productions',
                            developerUrl: 'https://www.kojimaproductions.jp/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411C7KJ',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411C7KJ',
                            ostUrl: 'https://www.bilibili.com/video/BV1vx411C7yZ'
                        },
                        {
                            name: '刺客信条：英灵殿',
                            nameEn: "Assassin's Creed Valhalla",
                            developer: 'Ubisoft',
                            developerUrl: 'https://www.ubisoft.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1DA41177wU',
                            cgUrl: 'https://www.bilibili.com/video/BV1DA41177wU',
                            ostUrl: 'https://www.bilibili.com/video/BV1iA41177rs'
                        },
                        {
                            name: '耻辱2',
                            nameEn: 'Dishonored 2',
                            developer: 'Arkane Studios',
                            developerUrl: 'https://www.arkane-studios.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1xs411x7oM',
                            cgUrl: 'https://www.bilibili.com/video/BV1xs411x7oM',
                            ostUrl: 'https://www.bilibili.com/video/BV1Fs411x7iN'
                        }
                    ]
                }
            ]
        }
    ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_WORLD_DATA;
}