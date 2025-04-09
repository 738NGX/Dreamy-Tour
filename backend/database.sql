-- 开启外键约束
PRAGMA foreign_keys = ON;

-- @@@@@@@@@@@@@ 基本表 @@@@@@@@@@@@@
-- 用户表 users
CREATE TABLE users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT,        -- 昵称（1 ~ 10个字符）
    wxOpenid TEXT,        -- 该小程序的 openid
    gender INTEGER,       -- 性别：女（0）、男（1）、保密（3）
    avatarUrl TEXT,       -- 用户头像地址
    email TEXT,           -- 邮箱地址
    password TEXT,        -- 密码哈希
    phone TEXT,           -- 手机号
    signature TEXT,       -- 个性签名（1 ~ 100个字符）
    birthday TEXT,        -- 生日（yyyy-mm-dd）
    roleId INTEGER,       -- 角色 ID（0 ~ 7），数字越高，权限越高，详见文档
    lastLoginAt INTEGER,  -- 上次的登录时间戳
    status INTEGER,       -- 状态（0 启用、1 禁用）
    exp INTEGER,          -- 经验值
    createdAt INTEGER,    -- 创建时间戳
    updatedAt INTEGER     -- 更新时间戳
);

-- 频道表
CREATE TABLE channels (
    channelId INTEGER PRIMARY KEY,          -- 频道 ID
    name TEXT,                              -- 频道名称            
    description TEXT,                       -- 频道描述
    masterId INTEGER,                       -- 频道主用户 ID（目前用户 Id: 1 ~ 40）
    status INTEGER,                         -- 用户状态（0 启用、1 禁用）
    humanCount INTEGER,                     -- 人数（创建时置为 1，因为频道主一定要在该频道）
    level INTEGER,                          -- 频道等级：-1（S 级，只能有一个，不可创建）、0（A 级）、1（B 级）、2（C 级）
    joinWay INTEGER,                        -- 频道加入方式：0 表示可直接加入，1 表示仅限邀请
    createdAt INTEGER,                      -- 创建时间戳
    updatedAt INTEGER,                      -- 更新时间戳
    FOREIGN KEY (masterId) REFERENCES users(uid) ON DELETE CASCADE
);

-- 频道个人表
CREATE TABLE channel_users (
    uid INTEGER,
    channelId INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    PRIMARY KEY (uid, channelId),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (channelId) REFERENCES channels(channelId) ON DELETE CASCADE
);

-- 频道管理员表
CREATE TABLE channel_admins (
    uid INTEGER,
    channelId INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    PRIMARY KEY (uid, channelId),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (channelId) REFERENCES channels(channelId) ON DELETE CASCADE
);

-- 帖子表
CREATE TABLE posts (
    postId INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER,
    channelId INTEGER,
    categoryId INTEGER,
    title TEXT,
    pictureUrls TEXT,
    content TEXT,
    clickSum INTEGER,
    likeSum INTEGER,
    commentSum INTEGER,
    forwardSum INTEGER,
    favoriteSum INTEGER,
    status INTEGER,
    ipAddress TEXT,
    hotScore REAL,
    isSticky INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (channelId) REFERENCES channels(channelId) ON DELETE CASCADE
);

-- 点赞表 likes
CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    objType INTEGER,
    objId INTEGER,
    uid INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- 帖子收藏表 post_favorites
CREATE TABLE post_favorites (
    postId INTEGER PRIMARY KEY,
    uid INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (uid) REFERENCES users(uid)
);

-- 评论表 comments
CREATE TABLE comments (
    commentId INTEGER PRIMARY KEY,
    uid INTEGER,
    postId INTEGER,
    parentId INTEGER,
    rootId INTEGER,
    content TEXT,
    pictureUrls TEXT,
    likeSum INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES posts(postId) ON DELETE CASCADE
);

-- 群组表 groups 
CREATE TABLE groups (
    groupId INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    masterId INTEGER,
    status INTEGER,
    humanCount INTEGER,
    linkedChannel INTEGER,
    qrCode TEXT,
    level INTEGER,
    joinWay INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (linkedChannel) REFERENCES channels(channelId) ON DELETE CASCADE,
    FOREIGN KEY (masterId) REFERENCES users(uid) ON DELETE CASCADE
);

-- 群组个人表
CREATE TABLE group_users (
    uid INTEGER,
    groupId INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    PRIMARY KEY (uid, groupId),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (groupId) REFERENCES groups(groupId) ON DELETE CASCADE
);

-- 群组管理员表
CREATE TABLE group_admins (
    uid INTEGER,
    groupId INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    PRIMARY KEY (uid, groupId),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (groupId) REFERENCES groups(groupId) ON DELETE CASCADE
);

-- 行程表 tours
CREATE TABLE tours (
    tourId INTEGER PRIMARY KEY,
    title TEXT,
    status INTEGER,
    linkedChannel INTEGER,
    channelVisible INTEGER,
    linkedGroup INTEGER,
    startDate INTEGER,
    endDate INTEGER,
    timeOffset INTEGER,
    mainCurrency INTEGER,
    subCurrency INTEGER,
    currencyExchangeRate INTEGER,
    nodeCopyNames TEXT,
    budgets TEXT,
    locations TEXT,
    transportations TEXT,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (linkedChannel) REFERENCES channels(channelId) ON DELETE CASCADE,
    FOREIGN KEY (linkedGroup) REFERENCES groups(groupId) ON DELETE CASCADE
);

-- 行程个人表
CREATE TABLE tour_users (
    uid INTEGER,
    tourId INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    PRIMARY KEY (uid, tourId),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (tourId) REFERENCES tours(tourId) ON DELETE CASCADE
);


-- @@@@@@@@@@@@@ 触发器 @@@@@@@@@@@@@
-- @@@@@@@@@@@@@ 频道表（channels）@@@@@@@@@@@@@
-- 创建加入频道时的触发器
CREATE TRIGGER IF NOT EXISTS increment_human_count
AFTER INSERT ON channel_users
BEGIN
    UPDATE channels
    SET humanCount = humanCount + 1
    WHERE channelId = NEW.channelId;
END;

-- 创建退出频道时的触发器
CREATE TRIGGER IF NOT EXISTS decrement_human_count
AFTER DELETE ON channel_users
BEGIN
    UPDATE channels
    SET humanCount = humanCount - 1
    WHERE channelId = OLD.channelId;
END;

-- @@@@@@@@@@@@@ 群组表（groups）@@@@@@@@@@@@@
-- 创建加入群组时的触发器
CREATE TRIGGER IF NOT EXISTS increment_group_human_count
AFTER INSERT ON group_users
BEGIN
    UPDATE groups
    SET humanCount = humanCount + 1
    WHERE groupId = NEW.groupId;
END;

-- 创建退出群组时的触发器
CREATE TRIGGER IF NOT EXISTS decrement_group_human_count
AFTER DELETE ON group_users
BEGIN
    UPDATE groups
    SET humanCount = humanCount - 1
    WHERE groupId = OLD.groupId;
END;


-- @@@@@@@@@@@@@ 帖子表（posts）@@@@@@@@@@@@@
-- 创建点赞帖子时的触发器
CREATE TRIGGER IF NOT EXISTS increment_like_sum
AFTER INSERT ON likes
WHEN NEW.objType = 0
BEGIN
    UPDATE posts
    SET likeSum = likeSum + 1
    WHERE postId = NEW.objId;
END;

-- 创建取消点赞帖子时的触发器
CREATE TRIGGER IF NOT EXISTS decrement_like_sum
AFTER DELETE ON likes
WHEN OLD.objType = 0
BEGIN
    UPDATE posts
    SET likeSum = likeSum - 1
    WHERE postId = OLD.objId;
END;

-- 创建评论帖子时的触发器
CREATE TRIGGER IF NOT EXISTS increment_comment_sum
AFTER INSERT ON comments
BEGIN
    UPDATE posts
    SET commentSum = commentSum + 1
    WHERE postId = NEW.postId;
END;

-- 创建删除评论时的触发器
CREATE TRIGGER IF NOT EXISTS decrement_comment_sum
AFTER DELETE ON comments
BEGIN
    UPDATE posts
    SET commentSum = commentSum - 1
    WHERE postId = OLD.postId;
END;

-- 创建收藏帖子时的触发器
CREATE TRIGGER IF NOT EXISTS increment_favorite_sum
AFTER INSERT ON post_favorites
BEGIN
    UPDATE posts
    SET favoriteSum = favoriteSum + 1
    WHERE postId = NEW.postId;
END;

-- 创建取消收藏帖子时的触发器
CREATE TRIGGER IF NOT EXISTS decrement_favorite_sum
AFTER DELETE ON post_favorites
BEGIN
    UPDATE posts
    SET favoriteSum = favoriteSum - 1
    WHERE postId = OLD.postId;
END;

-- @@@@@@@@@@@@@ 评论表（comments）@@@@@@@@@@@@@
-- 点赞评论触发器
CREATE TRIGGER IF NOT EXISTS increment_comment_like_sum
AFTER INSERT ON likes
WHEN NEW.objType = 1
BEGIN
    UPDATE comments
    SET likeSum = likeSum + 1
    WHERE commentId = NEW.objId;
END;

-- 取消点赞评论触发器
CREATE TRIGGER IF NOT EXISTS decrement_comment_like_sum
AFTER DELETE ON likes
WHEN OLD.objType = 1
BEGIN
    UPDATE comments
    SET likeSum = likeSum - 1
    WHERE commentId = OLD.objId;
END;


-- 创建用户roleId对于exp的触发器,当exp改变且roleId不为7时,根据exp的值重新确定roleId
CREATE TRIGGER IF NOT EXISTS update_roleId_on_exp_change
AFTER UPDATE OF exp ON users
WHEN NEW.exp <> OLD.exp AND NEW.roleId <> 7
BEGIN
    UPDATE users
    SET roleId = CASE 
            WHEN NEW.exp < 20 THEN 0
            WHEN NEW.exp < 150 THEN 1
            WHEN NEW.exp < 450 THEN 2
            WHEN NEW.exp < 1080 THEN 3
            WHEN NEW.exp < 2880 THEN 4
            WHEN NEW.exp < 10000 THEN 5
            ELSE 6
        END
    WHERE uid = NEW.uid;
END;


-- @@@@@@@@@@@@@ 视图 @@@@@@@@@@@@@
-- 创建帖子点赞表视图（筛选 objType 为 0 的记录，代表帖子点赞）
CREATE VIEW IF NOT EXISTS post_likes AS
SELECT
    id,
    objId AS postId,
    uid,
    createdAt,
    updatedAt
FROM likes
WHERE objType = 0;

-- 创建评论点赞表视图（筛选 objType 为 1 的记录，代表评论点赞）
CREATE VIEW IF NOT EXISTS comment_likes AS
SELECT
    id,
    objId AS commentId,
    uid,
    createdAt,
    updatedAt
FROM likes
WHERE objType = 1;


-- @@@@@@@@@@@@@@@@ 插入假数据 @@@@@@@@@@@@@@@@
-- 用户表 users
INSERT INTO users (nickname, wxOpenid, gender, avatarUrl, email, phone, signature, birthday, exp, roleId, lastLoginAt, status, createdAt, updatedAt) VALUES
    ('高坂穗乃果', 'o2_8VtFp9Lq3mNkZwXyAbC_805', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default1.png', 'kosaka.honoka@mius.com', '09012345678', 'Fightだよ！', '1994-08-03', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('绚濑绘里', 'o2_9GhJiKkLlMmNnOoPpQq_806', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default2.png', 'ayase.eli@mius.com', '09012345679', 'Coolでいきましょう', '1994-10-21', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('南小鸟', 'o2_RsTuUvVwWxYyZzAaBb_807', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default3.png', 'minami.kotori@mius.com', '09012345680', 'ほんのり幸せ～', '1994-09-12', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('园田海未', 'o2_CdEfGhIjKlMnOpQrSt_808', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default4.png', 'sonoda.umi@mius.com', '09012345681', '恥ずかしいです…', '1994-03-15', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('星空凛', 'o2_UvWxYzAbCdEfGhIjKl_809', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default5.png', 'hoshizora.rin@mius.com', '09012345682', 'にゃ～', '1994-11-01', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('西木野真姬', 'o2_MnOpQrStUvWxYzAbCd_810', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default6.png', 'nishikino.maki@mius.com', '09012345683', '違うわよ！', '1994-04-19', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('东条希', 'o2_EfGhIjKlMnOpQrStUv_811', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default7.png', 'toujou.nozomi@mius.com', '09012345684', 'ズッ友やで～', '1994-06-09', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('小泉花阳', 'o2_WxYzAbCdEfGhIjKlMn_812', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default8.png', 'koizumi.hanayo@mius.com', '09012345685', 'ご飯…おいしい', '1994-01-17', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('矢泽妮可', 'o2_OpQrStUvWxYzAbCdEf_813', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default9.png', 'yazawa.nico@mius.com', '09012345686', 'にっこにっこにー！', '1994-07-22', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('高海千歌', 'o2_GhIjKlMnOpQrStUvWx_814', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default10.png', 'takami.chika@aqours.com', '09012345687', 'みんなで叶える物語！', '2001-08-01', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('樱内梨子', 'o2_YzAbCdEfGhIjKlMnOp_815', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default11.png', 'sakurauchi.riko@aqours.com', '09012345688', '勇気を出して…', '2001-09-19', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('松浦果南', 'o2_QrStUvWxYzAbCdEfGhI_816', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default12.png', 'matsuura.kanan@aqours.com', '09012345689', '海が好きだから', '2000-02-10', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('黑泽黛雅', 'o2_KlMnOpQrStUvWxYzAb_817', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default13.png', 'kurosawa.dia@aqours.com', '09012345690', '完璧です！', '2000-01-01', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('渡边曜', 'o2_CdEfGhIjKlMnOpQrStU_818', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default14.png', 'watanabe.you@aqours.com', '09012345691', 'ヨーソロー！', '2001-04-17', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('津岛善子', 'o2_VwXyZzAaBbCcDdEeFf_819', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default15.png', 'tsushima.yoshiko@aqours.com', '09012345692', '堕天使ヨハネよ！', '2001-07-13', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('国木田花丸', 'o2_GgHhIiJjKkLlMmNnOo_820', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default16.png', 'kunikida.hanamaru@aqours.com', '09012345693', 'ずら～', '2001-03-04', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('小原鞠莉', 'o2_PpQqRrSsTtUuVvWwXx_821', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default17.png', 'ohara.mari@aqours.com', '09012345694', 'シャイニ～！', '2000-06-13', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('黑泽露比', 'o2_YyZzAaBbCcDdEeFfGg_822', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default18.png', 'kurosawa.ruby@aqours.com', '09012345695', 'がんばります！', '2002-09-21', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('上原步梦', 'o2_HhIiJjKkLlMmNnOoPp_823', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default19.png', 'uehara.ayumu@niji.com', '09012345696', 'ずっと、一緒に…', '2003-04-08', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('中须霞', 'o2_QqRrSsTtUuVvWwXxYy_824', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default20.png', 'nakasu.kasumi@niji.com', '09012345697', 'かすみん、最強！', '2003-08-08', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('樱坂雫', 'o2_ZzAaBbCcDdEeFfGgHh_825', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default21.png', 'sakurazaka.shizuku@niji.com', '09012345698', 'みんなを笑顔に', '2003-12-15', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('朝香果林', 'o2_IiJjKkLlMmNnOoPpQq_826', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default22.png', 'asaka.karin@niji.com', '09012345699', 'セクシーに決めるわ', '2002-09-15', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('宫下爱', 'o2_RrSsTtUuVvWwXxYyZz_827', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default23.png', 'miyashita.ai@niji.com', '09012345700', 'あいあい！', '2003-05-05', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('近江彼方', 'o2_AaBbCcDdEeFfGgHhIi_828', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default24.png', 'oumi.kanata@niji.com', '09012345701', 'おねむ…', '2002-02-28', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('优木雪菜', 'o2_JjKkLlMmNnOoPpQqRr_829', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default25.png', 'yuuki.setsuna@niji.com', '09012345702', '燃えてきた！', '2003-12-14', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('艾玛·维尔德', 'o2_SsTtUuVvWwXxYyZzAa_830', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default26.png', 'emma.verde@niji.com', '09012345703', 'Let''s ハグ！', '2002-05-10', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('天王寺璃奈', 'o2_BbCcDdEeFfGgHhIiJj_831', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default27.png', 'tennouji.rina@niji.com', '09012345704', '（表情パネル）', '2003-10-09', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('三船栞子', 'o2_KkLlMmNnOoPpQqRrSs_832', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default30.png', 'mifune.shioriko@niji.com', '09012345705', '冷静に考えましょう', '2004-11-11', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('米娅·泰勒', 'o2_CcDdEeFfGgHhIiJjKk_834', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default29.png', 'mia.taylor@niji.com', '09012345707', 'Music is my life!', '2004-07-07', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('钟岚珠', 'o2_TtUuVvWwXxYyZzAaBb_833', 0, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default28.png', 'zhong.lanzhu@niji.com', '09012345706', '世界一の学園偶像！', '2004-06-15', 55, 1, 1741518710234, 0, 1741483017852, 1741483017852),
    ('Franctoryer', 'o2_CL7Rs3-9QvoE8zBY8XQrw_804', 1, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default7.png', '643612824@qq.com', '13636452530', '手持两把锟斤拷，口中疾呼烫烫烫', '2003-09-26', 55, 1, 1741518410157, 0, 1741483017852, 1741483017852),
    ('738NGX', 'o2_CL7Wa9ja0M95V3Eg7Y0hfKTdc', 1, 'https://dreamy-tour-1319433252.cos.ap-beijing.myqcloud.com/avatar/default27.png', 'jny738ngx@gmail.com', '17317371970', '未来ずら～', '2004-02-10', 12345, 6, 1741518410157, 0, 1741483017852, 1741483017852);

-- 频道表 channels
INSERT INTO channels (channelId, name, description, masterId, status, humanCount, level, joinWay, createdAt, updatedAt) VALUES
  (1, '世界频道', '大家一起实现梦想的公共频道', 1, 0, 1, -1, 0, 1741509435699, 1741509435699),
  (2, '开发者频道', '不觉得这很酷吗? 我觉得这太酷了', 32, 0, 1, 0, 0, 1741509435699, 1741509435699),
  (3, '上财辣辣人同好会', 'みんなで叶える物語', 32, 0, 1, 1, 0, 1741509435699, 1741509435699),
  (4, '川藏线自驾联盟', 'G318国道自驾攻略分享', 32, 0, 1, 0, 0, 1741509435700, 1741509435700),
  (5, '东南亚潜水小队', '仙本那/斯米兰潜水约伴', 32, 0, 1, 1, 0, 1741509435701, 1741509435701),
  (6, '古镇漫游者', '江南六大古镇打卡指南', 32, 0, 1, 2, 0, 1741509435702, 1741509435702),
  (7, '雪山攀登计划', '哈巴/玉珠峰攀登组队', 32, 0, 1, 0, 0, 1741509435703, 1741509435703),
  (8, '环球背包客', '青旅拼房&长途路线规划', 32, 0, 1, 1, 0, 1741509435704, 1741509435704),
  (9, '美食地图挖掘', '『米其林vs街头小吃评测』', 32, 0, 1, 2, 0, 1741509435705, 1741509435705),
  (10, '房车旅行之家', '营地信息共享&车辆改装', 32, 0, 1, 0, 0, 1741509435706, 1741509435706),
  (11, '极光追猎者', '冰岛/挪威极光观测团', 32, 0, 1, 1, 0, 1741509435707, 1741509435707),
  (12, '亲子露营公社', '江浙沪优质营地推荐', 32, 0, 1, 2, 0, 1741509435708, 1741509435708),
  (13, '非遗文化之旅', '传统手工艺体验路线', 32, 0, 1, 0, 0, 1741509435709, 1741509435709),
  (14, '徒步中国', '十大经典徒步路线约伴', 32, 0, 1, 1, 0, 1741509435710, 1741509435710),
  (15, '海岛控集合', '马尔代夫选岛指南', 32, 1, 1, 2, 0, 1741509435711, 1741509435711),
  (16, '摄影旅拍小队', '无人机航拍技巧交流', 32, 0, 1, 0, 0, 1741509435712, 1741509435712),
  (17, '大学生穷游组', '火车硬座特种兵攻略', 32, 0, 1, 1, 0, 1741509435713, 1741509435713),
  (18, '滑雪搭子速配', '北海道粉雪季组队', 32, 0, 1, 2, 0, 1741509435714, 1741509435714),
  (19, '古迹探秘者', '世界遗产巡礼路线', 32, 0, 1, 0, 0, 1741509435715, 1741509435715),
  (20, '自驾丝绸之路', '河西走廊历史穿越之旅', 32, 0, 1, 1, 0, 1741509435716, 1741509435716),
  (21, '骑行318', '成都到拉萨装备清单', 32, 0, 1, 2, 0, 1741509435717, 1741509435717),
  (22, '旅居办公联盟', '数字游民签证政策解读', 32, 0, 1, 0, 0, 1741509435718, 1741509435718),
  (23, '秘境探险组', '穿越丙察察路线实况', 32, 0, 1, 1, 0, 1741509435719, 1741509435719),
  (24, '邮轮旅行指南', '地中海航线比价分析', 32, 0, 1, 2, 0, 1741509435720, 1741509435720),
  (25, '候鸟养老旅居', '三亚vs西双版纳过冬', 32, 0, 1, 0, 0, 1741509435721, 1741509435721),
  (26, '星空摄影团', '纳米比亚暗夜保护区', 32, 0, 1, 1, 0, 1741509435722, 1741509435722),
  (27, '签证互助社', '申根签slot抢约攻略', 32, 0, 1, 2, 0, 1741509435723, 1741509435723),
  (28, '民宿体验官', '网红民宿试睡报告', 32, 0, 1, 0, 0, 1741509435724, 1741509435724),
  (29, '朝圣之路', '西班牙圣地亚哥徒步', 32, 0, 1, 1, 0, 1741509435725, 1741509435725),
  (30, '公路咖啡馆', '318国道精品咖啡馆地图', 32, 0, 1, 2, 0, 1741509435726, 1741509435726),
  (31, '旅伴匹配中心', '性格测试找合拍旅友', 32, 0, 1, 0, 0, 1741509435727, 1741509435727),
  (32, '房车水电桩', '全国充电桩实时地图', 32, 0, 1, 1, 0, 1741509435728, 1741509435728),
  (33, '航司羊毛党', 'BUG机票预警信息群', 32, 0, 1, 2, 0, 1741509435729, 1741509435729),
  (34, '旅拍穿搭志', '『出片率max的旅行穿搭』', 32, 0, 1, 0, 0, 1741509435730, 1741509435730),
  (35, '宠物旅行记', '『带毛孩子出游指南』', 32, 0, 1, 1, 0, 1741509435731, 1741509435731),
  (36, '火车漫游家', '『全国观光列车时刻表』', 32, 0, 1, 2, 0, 1741509435732, 1741509435732),
  (37, '户外安全课', '『野外急救知识培训』', 32, 0, 1, 0, 0, 1741509435733, 1741509435733),
  (38, '旅图交换站', '『明信片全球互寄计划』', 32, 0, 1, 1, 0, 1741509435734, 1741509435734),
  (39, '方言课堂', '『旅行常用方言速成』', 32, 0, 1, 2, 0, 1741509435735, 1741509435735),
  (40, '古迹修复志', '『敦煌壁画修复体验』', 32, 0, 1, 0, 0, 1741509435736, 1741509435736),
  (41, '地球酒馆', '『全球精酿啤酒地图』', 32, 0, 1, 1, 0, 1741509435737, 1741509435737),
  (42, '旅居植物园', '『多肉植物跨省托运』', 32, 0, 1, 2, 0, 1741509435738, 1741509435738),
  (43, '秘境方言', '『少数民族语言学习』', 32, 0, 1, 0, 0, 1741509435739, 1741509435739),
  (44, '旅行vlog课', '『运镜剪辑技巧教学』', 32, 0, 1, 1, 0, 1741509435740, 1741509435740),
  (45, '漂流笔记本', '『全球旅行者故事接龙』', 32, 0, 1, 2, 0, 1741509435741, 1741509435741),
  (46, '非遗美食团', '『跟着舌尖去旅行』', 32, 0, 1, 0, 0, 1741509435742, 1741509435742),
  (47, '星空观测组', '『最佳观星点推荐』', 32, 0, 1, 1, 0, 1741509435743, 1741509435743),
  (48, '旅居医疗站', '『高原反应预防指南』', 32, 0, 1, 2, 0, 1741509435744, 1741509435744),
  (49, '旅行书籍社', '『Lonely Planet共读』', 32, 0, 1, 0, 0, 1741509435745, 1741509435745),
  (50, '铁路迷之家', '『全国特色火车站打卡』', 32, 0, 1, 1, 0, 1741509435746, 1741509435746),
  (51, '机场过夜组', '『全球机场休息室评测』', 32, 0, 1, 2, 0, 1741509435747, 1741509435747),
  (52, '旅行冷知识', '『各国奇怪法律科普』', 32, 0, 1, 0, 0, 1741509435748, 1741509435748);    