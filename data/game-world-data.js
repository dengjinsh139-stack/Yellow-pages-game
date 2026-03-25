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
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Dark+Souls+3+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Dark+Souls+3+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=Dark+Souls+3+soundtrack',
                            worldDescription: '洛斯里克王国的火焰即将熄灭，不死人被唤醒执行传火使命。在破败的城堡与阴森的地下墓穴中，玩家将面对昔日的英雄与堕落的神明，探索火之时代的终结与轮回的宿命。'
                        },
                        {
                            name: '巫师3：狂猎',
                            nameEn: 'The Witcher 3: Wild Hunt',
                            developer: 'CD Projekt Red',
                            developerUrl: 'https://www.cdprojekt.com/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=The+Witcher+3+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=The+Witcher+3+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=The+Witcher+3+soundtrack',
                            worldDescription: '在大陆战火纷飞的年代，猎魔人杰洛特寻找失踪的养女希里。政治阴谋、种族冲突与超自然威胁交织，玩家的每一个选择都将影响这片大陆的命运走向。'
                        },
                        {
                            name: '艾尔登法环',
                            nameEn: 'Elden Ring',
                            developer: 'FromSoftware',
                            developerUrl: 'https://www.fromsoftware.jp/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Elden+Ring+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Elden+Ring+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=Elden+Ring+soundtrack',
                            worldDescription: '交界地的艾尔登法环破碎，半神们争夺大卢恩引发破碎战争。被玷污者重返这片土地，探索黄金树下的秘密，挑战半神，最终成为艾尔登之王或带来新时代的秩序。'
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
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Fire+Emblem+Three+Houses+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Fire+Emblem+Three+Houses+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=Fire+Emblem+Three+Houses+soundtrack',
                            worldDescription: '芙朵拉大陆上，三国鼎立。玩家作为士官学校教师，培养来自三个国家的年轻贵族。在学院日常与战场厮杀中，揭开千年历史的真相，决定大陆的未来。'
                        },
                        {
                            name: '最终幻想战略版',
                            nameEn: 'Final Fantasy Tactics',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+Tactics+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+Tactics+opening',
                            ostUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+Tactics+soundtrack',
                            worldDescription: '伊瓦利斯王国，两个贵族家族争夺王位的狮子战争。主角拉姆萨在阴谋与背叛中，逐渐揭开圣石背后的黑暗真相，挑战操纵历史的教会势力。'
                        },
                        {
                            name: 'XCOM 2',
                            nameEn: 'XCOM 2',
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=XCOM+2+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=XCOM+2+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=XCOM+2+soundtrack',
                            worldDescription: '外星征服者统治地球已二十年，XCOM组织沦为抵抗军。玩家指挥地下游击队，从废墟城市中招募战士，夺回地球自由，揭露外星人改造人类的阴谋。'
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
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+7+Remake+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+7+Remake+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+7+Remake+soundtrack',
                            worldDescription: '米德加都市，神罗公司榨取星球生命能源。前神罗战士克劳德加入雪崩组织，在破坏魔晄炉的任务中，逐渐发现自己过去的真相与星球命运的联系。'
                        },
                        {
                            name: '女神异闻录5 皇家版',
                            nameEn: 'Persona 5 Royal',
                            developer: 'Atlus',
                            developerUrl: 'https://www.atlus.co.jp/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Persona+5+Royal+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Persona+5+Royal+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=Persona+5+Royal+soundtrack',
                            worldDescription: '东京，心灵扭曲的大人构建腐败社会。一群高中生觉醒人格面具力量，潜入恶人内心的认知空间"宫殿"，偷取扭曲的欲望，让恶人悔改，成为侠盗团的革命物语。'
                        },
                        {
                            name: '勇者斗恶龙XI',
                            nameEn: 'Dragon Quest XI',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Dragon+Quest+11+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Dragon+Quest+11+opening',
                            ostUrl: 'https://www.youtube.com/results?search_query=Dragon+Quest+11+soundtrack',
                            worldDescription: '勇者诞生时即被预言将毁灭世界，故乡被魔王军攻陷后踏上旅程。在洛特泽塔西亚大陆上，勇者集结伙伴，揭开自己身世的秘密，对抗黑暗势力。'
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
                            gameplayUrl: 'https://www.youtube.com/results?search_query=World+of+Warcraft+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=World+of+Warcraft+cinematic',
                            ostUrl: 'https://www.youtube.com/results?search_query=World+of+Warcraft+soundtrack',
                            worldDescription: '艾泽拉斯大陆，联盟与部落战火绵延。从东部王国到外域，从诺森德到潘达利亚，英雄们对抗燃烧军团、古神低语与亡灵天灾，书写属于自己的传奇。'
                        },
                        {
                            name: '最终幻想XIV',
                            nameEn: 'Final Fantasy XIV',
                            developer: 'Square Enix',
                            developerUrl: 'https://www.square-enix.com/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+14+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+14+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=Final+Fantasy+14+soundtrack',
                            worldDescription: '海德林与佐迪亚克，光与暗的星球。冒险者从普通冒险者成长为光之战士，穿越第一世界与第十三世界，阻止末日降临，探索古代文明灭亡的真相。'
                        },
                        {
                            name: '原神',
                            nameEn: 'Genshin Impact',
                            developer: 'miHoYo',
                            developerUrl: 'https://www.mihoyo.com/',
                            gameplayUrl: 'https://www.youtube.com/results?search_query=Genshin+Impact+gameplay',
                            cgUrl: 'https://www.youtube.com/results?search_query=Genshin+Impact+trailer',
                            ostUrl: 'https://www.youtube.com/results?search_query=Genshin+Impact+soundtrack',
                            worldDescription: '旅行者寻找失散的血亲，游历提瓦特七国。每座城邦对应一种元素与一种理念，在探索中揭开"天理"与"神之眼"的秘密，见证神明的陨落与新秩序的建立。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1Xh411T7cL',
                            worldDescription: '全球反恐精英与恐怖分子之间的对抗。从炙热沙城到核子危机，经典的爆破模式与人质模式考验团队配合，是全球电竞史上最经典的FPS竞技游戏。'
                        },
                        {
                            name: '彩虹六号：围攻',
                            nameEn: "Tom Clancy's Rainbow Six Siege",
                            developer: 'Ubisoft',
                            developerUrl: 'https://www.ubisoft.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Us411d7TV',
                            cgUrl: 'https://www.bilibili.com/video/BV1es411d7Xj',
                            ostUrl: 'https://www.bilibili.com/video/BV1Us411d7Ha',
                            worldDescription: '全球反恐特种部队彩虹小队，面对白面具恐怖组织。可破坏的墙体、独特的干员技能、高度战术化的室内近距离作战，重新定义战术射击游戏体验。'
                        },
                        {
                            name: 'Valorant',
                            nameEn: 'Valorant',
                            developer: 'Riot Games',
                            developerUrl: 'https://www.riotgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1ka4y1i7NR',
                            cgUrl: 'https://www.bilibili.com/video/BV1Q54y1D7GH',
                            ostUrl: 'https://www.bilibili.com/video/BV1HZ4y1s7jm',
                            worldDescription: '近未来的地球，一场名为"First Light"的事件让部分人类获得超能力。特工们装备符文科技武器，在回合制战术射击中运用独特技能争夺胜利。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1nJ41187A4',
                            worldDescription: '地狱大军入侵地球，毁灭战士从地狱要塞苏醒。在火星与地狱的战场中，以狂暴的近战与火器撕裂恶魔，阻止地狱祭司吞噬人类灵魂的阴谋。'
                        },
                        {
                            name: '雷神之锤：冠军',
                            nameEn: 'Quake Champions',
                            developer: 'id Software',
                            developerUrl: 'https://www.idsoftware.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Ex41187hC',
                            cgUrl: 'https://www.bilibili.com/video/BV1px41187hH',
                            ostUrl: 'https://www.bilibili.com/video/BV1tx41187Xr',
                            worldDescription: '雷神之锤宇宙中的竞技场，来自不同时空的战士们为荣耀而战。火箭跳、空中转身、超高速移动，经典竞技场FPS的现代化演绎。'
                        },
                        {
                            name: '虚幻竞技场',
                            nameEn: 'Unreal Tournament',
                            developer: 'Epic Games',
                            developerUrl: 'https://www.epicgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx41187Xs',
                            cgUrl: 'https://www.bilibili.com/video/BV1vx41187Cj',
                            ostUrl: 'https://www.bilibili.com/video/BV1ix41187Mo',
                            worldDescription: '新地球政府的血腥竞技场赛事，参赛者使用各种未来武器互相厮杀。从传统的死亡竞赛到独特的占旗模式，纯粹的竞技射击体验。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1Jx411x7PM',
                            worldDescription: '在废弃的东欧岛屿上，一百名玩家空投作战。搜集武器、装备，在不断缩小的安全区内生存，成为最后站立的胜利者，开创大逃杀游戏类型。'
                        },
                        {
                            name: 'Apex英雄',
                            nameEn: 'Apex Legends',
                            developer: 'Respawn Entertainment',
                            developerUrl: 'https://www.respawn.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1nb411U7wT',
                            cgUrl: 'https://www.bilibili.com/video/BV1nb411U7wT',
                            ostUrl: 'https://www.bilibili.com/video/BV1Tb411U79K',
                            worldDescription: '边境星系，Apex竞技场比赛。来自泰坦陨落宇宙的传奇角色，三人小队合作，利用角色独特技能在快节奏战斗中生存，揭开源氏与IMC战争的后续。'
                        },
                        {
                            name: '使命召唤：战区',
                            nameEn: 'Call of Duty: Warzone',
                            developer: 'Infinity Ward',
                            developerUrl: 'https://www.infinityward.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1D7411s7ZK',
                            cgUrl: 'https://www.bilibili.com/video/BV1D7411s7ZK',
                            ostUrl: 'https://www.bilibili.com/video/BV1A7411s7Yc',
                            worldDescription: '佛丹斯科战区，150人同场竞技。从使命召唤现代战争宇宙中延伸，结合系列经典武器系统与载具，提供快节奏的大逃杀体验。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1wx411G7rY',
                            worldDescription: '科普鲁星区，人族、虫族、神族三足鼎立。吉姆·雷诺、凯瑞甘、阿塔尼斯等英雄的命运交织，对抗堕落的萨尔纳加与虚空中的黑暗。'
                        },
                        {
                            name: '帝国时代4',
                            nameEn: 'Age of Empires IV',
                            developer: 'Relic Entertainment',
                            developerUrl: 'https://www.relic.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1rL411G7Pe',
                            cgUrl: 'https://www.bilibili.com/video/BV1rL411G7Pe',
                            ostUrl: 'https://www.bilibili.com/video/BV1SL411G7uK',
                            worldDescription: '从黑暗时代到帝国时代，指挥历史上的伟大文明。英格兰、蒙古、中国等文明拥有独特单位与科技树，在中世纪战场上书写帝国兴衰。'
                        },
                        {
                            name: '全面战争：三国',
                            nameEn: 'Total War: Three Kingdoms',
                            developer: 'Creative Assembly',
                            developerUrl: 'https://www.creative-assembly.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Vb411L7xW',
                            cgUrl: 'https://www.bilibili.com/video/BV1Vb411L7xW',
                            ostUrl: 'https://www.bilibili.com/video/BV1Sb411L7mY',
                            worldDescription: '东汉末年，群雄逐鹿。扮演曹操、刘备、孙权等诸侯，通过回合制战略管理内政外交，实时战斗指挥千军万马，体验三国英雄的史诗篇章。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1Fs411x7iA',
                            worldDescription: '从石器时代到信息时代，领导文明跨越六千年。秦始皇、甘地、彼得大帝等领袖登场，发展科技、文化、宗教，建立能经受时间考验的帝国。'
                        },
                        {
                            name: 'XCOM 2',
                            nameEn: 'XCOM 2',
                            developer: 'Firaxis Games',
                            developerUrl: 'https://www.firaxis.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Us411X7Bg',
                            cgUrl: 'https://www.bilibili.com/video/BV1es411X7Hd',
                            ostUrl: 'https://www.bilibili.com/video/BV1Us411X7Du',
                            worldDescription: '外星征服者统治地球已二十年，XCOM组织沦为抵抗军。玩家指挥地下游击队，从废墟城市中招募战士，夺回地球自由，揭露外星人改造人类的阴谋。'
                        },
                        {
                            name: '神界：原罪2',
                            nameEn: 'Divinity: Original Sin 2',
                            developer: 'Larian Studios',
                            developerUrl: 'https://www.larian.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Ax411x7rT',
                            cgUrl: 'https://www.bilibili.com/video/BV1Ax411x7rT',
                            ostUrl: 'https://www.bilibili.com/video/BV1sx411x7bc',
                            worldDescription: '绿维珑世界，秘源术士被净源导师迫害。玩家扮演被囚禁的秘源术士，在浮空城中逃生，寻找成为神的方法，同时揭开虚空异兽入侵的真相。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1Fs411x7ih',
                            worldDescription: '银河系，数千星辰等待探索。从单一星球文明发展为星际帝国，遭遇外星种族、上古文明遗迹、维度裂缝。外交、战争、科技、种族特性，打造独特的太空史诗。'
                        },
                        {
                            name: '无尽空间2',
                            nameEn: 'Endless Space 2',
                            developer: 'Amplitude Studios',
                            developerUrl: 'https://www.amplitude-studios.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Ax411x7WE',
                            cgUrl: 'https://www.bilibili.com/video/BV1Ax411x7WE',
                            ostUrl: 'https://www.bilibili.com/video/BV1sx411x7Qm',
                            worldDescription: '无尽宇宙，多个独特种族争夺银河霸权。每个种族拥有专属任务链与胜利条件，从吞噬星球的藤智者到数字生命的虚拟族，体验完全不同的太空文明发展之路。'
                        },
                        {
                            name: '银河文明3',
                            nameEn: 'Galactic Civilizations III',
                            developer: 'Stardock',
                            developerUrl: 'https://www.stardock.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411x7oy',
                            cgUrl: 'https://www.bilibili.com/video/BV1vx411x7oT',
                            ostUrl: 'https://www.bilibili.com/video/BV1ix411x7oN',
                            worldDescription: '23世纪，人类首次接触外星文明。选择人类或外星种族，在巨大的银河地图上建立帝国。深度的飞船设计与外交系统，塑造属于你的太空文明传奇。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1jx411G7FH',
                            worldDescription: '符文之地，众多城邦与势力纷争不断。召唤师召唤英雄在正义之地战斗解决争端。从德玛西亚的骑士到诺克萨斯的刺客，每位英雄都有独特的背景故事与能力。'
                        },
                        {
                            name: 'DOTA2',
                            nameEn: 'Dota 2',
                            developer: 'Valve',
                            developerUrl: 'https://www.valvesoftware.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Gx411w7qw',
                            cgUrl: 'https://www.bilibili.com/video/BV1Gx411w7qw',
                            ostUrl: 'https://www.bilibili.com/video/BV1Ex411w7RB',
                            worldDescription: '天辉与夜魇两座远古遗迹矗立在战场上。英雄们为各自阵营而战，争夺神秘的神杖与不朽之守护。起源于魔兽争霸3的经典地图，电竞奖金最高的赛事之一。'
                        },
                        {
                            name: '风暴英雄',
                            nameEn: 'Heroes of the Storm',
                            developer: 'Blizzard Entertainment',
                            developerUrl: 'https://www.blizzard.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411w7Fe',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411w7Fe',
                            ostUrl: 'https://www.bilibili.com/video/BV1Vx411w7cy',
                            worldDescription: '时空枢纽，暴雪所有宇宙的交汇点。萨尔、迪亚波罗、凯瑞甘等传奇英雄跨越世界并肩作战。独特的团队经验共享机制与多样化战场目标，团队合作的极致体现。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1fx411C7oG',
                            worldDescription: '王者峡谷，东西方历史与神话人物齐聚一堂。李白、貂蝉、亚瑟等英雄在5v5战场上对决。专为手机优化的操作体验，全球最火爆的移动端MOBA游戏。'
                        },
                        {
                            name: '英雄联盟手游',
                            nameEn: 'League of Legends: Wild Rift',
                            developer: 'Riot Games',
                            developerUrl: 'https://www.riotgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1iK4y1E7MB',
                            cgUrl: 'https://www.bilibili.com/video/BV1iK4y1E7MB',
                            ostUrl: 'https://www.bilibili.com/video/BV1eK4y1E7vY',
                            worldDescription: '符文之地的移动端版本，保留英雄联盟核心玩法与英雄技能，针对触屏操作重新设计。同样的史诗战场，随时随地的5v5竞技体验。'
                        },
                        {
                            name: '无尽对决',
                            nameEn: 'Mobile Legends: Bang Bang',
                            developer: 'Moonton',
                            developerUrl: 'https://www.moonton.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1bx411C7mY',
                            cgUrl: 'https://www.bilibili.com/video/BV1bx411C7mY',
                            ostUrl: 'https://www.bilibili.com/video/BV1vx411C7Ty',
                            worldDescription: '幻境大陆，东西方神话融合的世界。每局10秒匹配，10分钟一局，快节奏的移动端MOBA体验。在东南亚与全球市场广受欢迎，国际化的电竞赛事体系。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1zW411j7wS',
                            worldDescription: '北欧神话世界，奎托斯带着儿子阿特柔斯踏上旅程。在米德加尔特的冰天雪地中，父子将面对诸神黄昏的预言，揭开神族与巨人的恩怨。'
                        },
                        {
                            name: '鬼泣5',
                            nameEn: 'Devil May Cry 5',
                            developer: 'Capcom',
                            developerUrl: 'https://www.capcom.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Bt411d7Nt',
                            cgUrl: 'https://www.bilibili.com/video/BV1Bt411d7Nt',
                            ostUrl: 'https://www.bilibili.com/video/BV1Jt411d7A7',
                            worldDescription: '恶魔猎人但丁、尼禄与新角色V联手对抗恶魔之王尤里曾。在风格化的战斗中施展华丽连击，揭开红魔之树事件的真相，系列15周年的巅峰之作。'
                        },
                        {
                            name: '猎天使魔女2',
                            nameEn: 'Bayonetta 2',
                            developer: 'PlatinumGames',
                            developerUrl: 'https://www.platinumgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1Dx411C7gJ',
                            cgUrl: 'https://www.bilibili.com/video/BV1Dx411C7gJ',
                            ostUrl: 'https://www.bilibili.com/video/BV1Tx411C7h6',
                            worldDescription: '魔女贝优妮塔为了拯救好友贞德，深入地狱与天使大军战斗。在神曲风格的地狱景观中，以变身、召唤魔物与华丽的格斗技巧击败神话中的神明。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1hx411u7AS',
                            worldDescription: '马里奥的帽子凯比拥有附身能力。在沙之国、森之国等独特的王国中冒险，收集月亮力量阻止酷霸王与桃花公主的婚礼，开启3D平台跳跃新纪元。'
                        },
                        {
                            name: '空洞骑士',
                            nameEn: 'Hollow Knight',
                            developer: 'Team Cherry',
                            developerUrl: 'https://www.teamcherry.com.au/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1vx411x7oy',
                            cgUrl: 'https://www.bilibili.com/video/BV1vx411x7oy',
                            ostUrl: 'https://www.bilibili.com/video/BV1Tx411x7SA',
                            worldDescription: '圣巢王国，一座巨大的地下昆虫文明废墟。玩家扮演沉默的骑士探索交错的地道，与疯狂的神明后裔战斗，揭开瘟疫的源头与自身存在的意义。'
                        },
                        {
                            name: '蔚蓝',
                            nameEn: 'Celeste',
                            developer: 'Maddy Makes Games',
                            developerUrl: 'http://www.maddymakesgames.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1kx411x7uc',
                            cgUrl: 'https://www.bilibili.com/video/BV1kx411x7uc',
                            ostUrl: 'https://www.bilibili.com/video/BV1bx411x7yw',
                            worldDescription: '玛德琳攀登塞莱斯特山，一座能实现愿望的神秘山峰。在精准的平台跳跃中，她面对内心的焦虑与抑郁，用毅力征服山峰也征服内心的恶魔。'
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
                            ostUrl: 'https://www.bilibili.com/video/BV1vx411C7yZ',
                            worldDescription: '1984年，大首领从昏迷中苏醒建立钻石犬佣兵团。在阿富汗与非洲的开放世界中执行潜行任务，建立基地、招募士兵，寻找摧毁MSF的凶手，揭开身份之谜。'
                        },
                        {
                            name: '刺客信条：英灵殿',
                            nameEn: "Assassin's Creed Valhalla",
                            developer: 'Ubisoft',
                            developerUrl: 'https://www.ubisoft.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1DA41177wU',
                            cgUrl: 'https://www.bilibili.com/video/BV1DA41177wU',
                            ostUrl: 'https://www.bilibili.com/video/BV1iA41177rs',
                            worldDescription: '维京时代，艾沃尔带领族人从挪威来到英格兰。在劫掠、定居与政治联盟中，与撒克逊国王和上古维序者斗争，同时揭开刺客与圣殿骑士千年战争的序幕。'
                        },
                        {
                            name: '耻辱2',
                            nameEn: 'Dishonored 2',
                            developer: 'Arkane Studios',
                            developerUrl: 'https://www.arkane-studios.com/',
                            gameplayUrl: 'https://www.bilibili.com/video/BV1xs411x7oM',
                            cgUrl: 'https://www.bilibili.com/video/BV1xs411x7oM',
                            ostUrl: 'https://www.bilibili.com/video/BV1Fs411x7iN',
                            worldDescription: '卡纳卡城邦，女巫德莱拉篡夺王位。玩家扮演科沃或艾米丽，利用超自然印记能力，在蒸汽朋克风格的城市中潜行或杀戮，夺回帝国的王座。'
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
