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
                            gameplayUrl: 'https://www.youtube.com/watch?v=cWBwFhUv1-8',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLD6B1F7E4B4C8B6E7'
                        },
                        {
                            name: '巫师3：狂猎',
                            nameEn: 'The Witcher 3: Wild Hunt',
                            developer: 'CD Projekt Red',
                            developerUrl: 'https://www.cdprojekt.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=c0i88tKZRMo',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '艾尔登法环',
                            nameEn: 'Elden Ring',
                            developer: 'FromSoftware',
                            developerUrl: 'https://www.fromsoftware.jp/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=E3Huy2cdih0',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=8V5L6v1a3v8',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '最终幻想战略版',
                            nameEn: 'Final Fantasy Tactics',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: 'XCOM 2',
                            nameEn: 'XCOM 2',
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=ERgrFVhL-n4',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '女神异闻录5 皇家版',
                            nameEn: 'Persona 5 Royal',
                            developer: 'Atlus',
                            developerUrl: 'https://www.atlus.co.jp/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=2n1zB8r8e1o',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '勇者斗恶龙XI',
                            nameEn: 'Dragon Quest XI',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=jSJr3dXZfcg',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '最终幻想XIV',
                            nameEn: 'Final Fantasy XIV',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=4fV0vS6X2xE',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '原神',
                            nameEn: 'Genshin Impact',
                            developer: 'miHoYo',
                            developerUrl: 'https://www.mihoyo.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=SF4l5C6T2zA',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=c8L_h9h3x7s',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '彩虹六号：围攻',
                            nameEn: 'Tom Clancy\'s Rainbow Six Siege',
                            developer: 'Ubisoft',
                            developerUrl: 'https://www.ubisoft.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=weR3zX9U5Rk',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: 'Valorant',
                            nameEn: 'Valorant',
                            developer: 'Riot Games',
                            developerUrl: 'https://www.riotgames.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=e_E9W2vsRbQ',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=H9f9T-xV3i4',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '雷神之锤：冠军',
                            nameEn: 'Quake Champions',
                            developer: 'id Software',
                            developerUrl: 'https://www.idsoftware.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=3r8u0w8b6e1',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '虚幻竞技场',
                            nameEn: 'Unreal Tournament',
                            developer: 'Epic Games',
                            developerUrl: 'https://www.epicgames.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=OUeQjwzS4xQ',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: 'Apex英雄',
                            nameEn: 'Apex Legends',
                            developer: 'Respawn Entertainment',
                            developerUrl: 'https://www.respawn.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=7My2U5q3r6g',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '使命召唤：战区',
                            nameEn: 'Call of Duty: Warzone',
                            developer: 'Infinity Ward',
                            developerUrl: 'https://www.infinityward.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=0E3z4E8d9r0',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=MIr0hJ8T4zQ',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '帝国时代4',
                            nameEn: 'Age of Empires IV',
                            developer: 'Relic Entertainment',
                            developerUrl: 'https://www.relic.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5TnYV3l0z4o',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '全面战争：三国',
                            nameEn: 'Total War: Three Kingdoms',
                            developer: 'Creative Assembly',
                            developerUrl: 'https://www.creative-assembly.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=1n0yL3k2m9s',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            nameEn: 'Sid Meier\'s Civilization VI',
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: 'XCOM 2',
                            nameEn: 'XCOM 2',
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '神界：原罪2',
                            nameEn: 'Divinity: Original Sin 2',
                            developer: 'Larian Studios',
                            developerUrl: 'https://www.larian.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5oL3c8b7z9w',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=1d8m7z9o9q8',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '无尽空间2',
                            nameEn: 'Endless Space 2',
                            developer: 'Amplitude Studios',
                            developerUrl: 'https://www.amplitude-studios.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '银河文明3',
                            nameEn: 'Galactic Civilizations III',
                            developer: 'Stardock',
                            developerUrl: 'https://www.stardock.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=0qoPv3-kZQY',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: 'DOTA2',
                            nameEn: 'Dota 2',
                            developer: 'Valve',
                            developerUrl: 'https://www.valvesoftware.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=Smn1_liD_Xk',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '风暴英雄',
                            nameEn: 'Heroes of the Storm',
                            developer: 'Blizzard Entertainment',
                            developerUrl: 'https://www.blizzard.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '英雄联盟手游',
                            nameEn: 'League of Legends: Wild Rift',
                            developer: 'Riot Games',
                            developerUrl: 'https://www.riotgames.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '无尽对决',
                            nameEn: 'Mobile Legends: Bang Bang',
                            developer: 'Moonton',
                            developerUrl: 'https://www.moonton.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=4E4y9b0w8v4',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '鬼泣5',
                            nameEn: 'Devil May Cry 5',
                            developer: 'Capcom',
                            developerUrl: 'https://www.capcom.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '猎天使魔女2',
                            nameEn: 'Bayonetta 2',
                            developer: 'PlatinumGames',
                            developerUrl: 'https://www.platinumgames.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '空洞骑士',
                            nameEn: 'Hollow Knight',
                            developer: 'Team Cherry',
                            developerUrl: 'https://www.teamcherry.com.au/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '蔚蓝',
                            nameEn: 'Celeste',
                            developer: 'Maddy Makes Games',
                            developerUrl: 'http://www.maddymakesgames.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PL0f0Lh8V2eJz1Wb1yK3x8L3Y8k9Y7uI6T'
                        },
                        {
                            name: '刺客信条：英灵殿',
                            nameEn: 'Assassin\'s Creed Valhalla',
                            developer: 'Ubisoft',
                            developerUrl: 'https://www.ubisoft.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=5k8G6d8C7e9',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLv3bW8g7Xz8K8eP2r5tY6uI9o0p1q2w3e'
                        },
                        {
                            name: '耻辱2',
                            nameEn: 'Dishonored 2',
                            developer: 'Arkane Studios',
                            developerUrl: 'https://www.arkane-studios.com/',
                            gameplayUrl: 'https://www.youtube.com/watch?v=9e4L3R8m5n7',
                            ostUrl: 'https://www.youtube.com/playlist?list=PLoP4m2y8b0qR7sT9uV2wX4yZ5aB6cD8eF'
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