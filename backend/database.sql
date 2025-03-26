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
    phone TEXT,           -- 手机号
    signature TEXT,       -- 个性签名（1 ~ 100个字符）
    birthday TEXT,        -- 生日（yyyy-mm-dd）
    roleId INTEGER,       -- 角色 ID（0 ~ 7），数字越高，权限越高，详见文档
    lastLoginAt INTEGER,  -- 上次的登录时间戳
    status INTEGER,       -- 状态（0 启用、1 禁用）
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
    FOREIGN KEY (masterId) REFERENCES users(uid)
);

-- 频道个人表
CREATE TABLE channel_users (
    uid INTEGER,
    channelId INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    PRIMARY KEY (uid, channelId),
    FOREIGN KEY (uid) REFERENCES users(uid),
    FOREIGN KEY (channelId) REFERENCES channels(channelId)
);

-- 频道管理员表
CREATE TABLE channel_admins (
    uid INTEGER,
    channelId INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    PRIMARY KEY (uid, channelId),
    FOREIGN KEY (uid) REFERENCES users(uid),
    FOREIGN KEY (channelId) REFERENCES channels(channelId)
);

-- 帖子表
CREATE TABLE posts (
    postId INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER,
    channelId INTEGER,
    categoryId INTEGER,
    title TEXT UNIQUE,
    pictureUrls TEXT,
    content TEXT,
    clickSum INTEGER,
    likeSum INTEGER,
    commentSum INTEGER,
    forwardSum INTEGER,
    status INTEGER,
    ipAddress TEXT,
    hotScore REAL,
    isSticky INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (uid) REFERENCES users(uid) 
    FOREIGN KEY (channelId) REFERENCES channels(channelId)
);

-- 点赞表 likes
CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    objType INTEGER,
    objId INTEGER,
    uid INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (uid) REFERENCES users(uid)
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
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY (uid) REFERENCES user_info(uid),
    FOREIGN KEY (postId) REFERENCES posts(postId)
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
INSERT INTO users (nickname, wxOpenid, gender, avatarUrl, email, phone, signature, birthday, roleId, lastLoginAt, status, createdAt, updatedAt) VALUES
  ('Franctoryer', 'o2_CL7Rs3-9QvoE8zBY8XQrw_804', 2, 'http://default.avatar.com', '643612824@qq.com', '13636452530', '手持两把锟斤拷，口中疾呼烫烫烫', '2003-09-26', 1, 1741518410157, 0, 1741483017852, 1741483017852),
  ('EvelynSmith', 'o2_8VtFp9Lq3mNkZwXyAbC_805', 0, 'https://avatar1.com/evan.jpg', 'evelyn.smith@example.com', '+13015102345', '追风赶月莫停留，平芜尽处是春山', '1992-05-18', 1, 1741518710234, 0, 1741483017852, 1741483017852),
  ('张伟', 'o2_LpMnOqRt5sUvXzYwAbD_806', 1, 'http://avatar.com/zhangwei.png', 'zhangwei@example.com.cn', '8613912345678', '仰天大笑出门去，我辈岂是蓬蒿人', '1988-03-20', 2, 1741519010311, 0, 1741483017852, 1741483017852),
  ('LilyJohnson', 'o2_MpSoUhJk7vBnCmDeEf_807', 0, 'https://avatar2.com/lily.png', 'lily.johnson@example.co.uk', '+447912345678', '人生如逆旅，我亦是行人', '2000-07-15', 1, 1741519310388, 0, 1741483017852, 1741483017852),
  ('王芳', 'o2_NqTrGhIj8vDfXkLmNo_808', 3, 'http://avatar.com/wangfang.jpg', 'wangfang@example.com', '8613812345678', '一蓑烟雨任平生', '1995-11-30', 1, 1741519610465, 0, 1741483017852, 1741483017852),
  ('DavidLee', 'o2_PqWzXyAbClDfGhIjK_809', 1, 'https://avatar3.com/david.png', 'david.lee@example.com', '+8613800138000', '曾经沧海难为水，除却巫山不是云', '1985-04-20', 2, 1741519910542, 0, 1741483017852, 1741483017852),
  ('EmilyWang', 'o2_QrTfGhIjKlMnOpQ_810', 0, 'https://avatar4.com/emily.jpg', 'emily.wang@example.com', '+8613912345679', '问君能有几多愁？恰似一江春水向东流', '1998-06-15', 1, 1741520210617, 0, 1741483017852, 1741483017852),
  ('李明', 'o2_RsTuVwXyAbCdEfGh_811', 1, 'http://avatar.com/liming.jpg', 'liming@example.com', '8613712345678', '天生我材必有用，千金散尽还复来', '1990-02-28', 2, 1741520510692, 0, 1741483017852, 1741483017852),
  ('SophiaBrown', 'o2_TuVwXyAbCdEfGhIj_812', 0, 'https://avatar5.com/sophia.png', 'sophia.brown@example.com', '+447712345678', '不畏浮云遮望眼，自缘身在最高层', '2002-11-05', 1, 1741520810767, 0, 1741483017852, 1741483017852),
  ('陈浩', 'o2_UvXyAbCdEfGhIjKl_813', 1, 'http://avatar.com/chenhao.png', 'chenhao@example.com.cn', '8613612345678', '大鹏一日同风起，扶摇直上九万里', '1987-08-15', 2, 1741521110842, 0, 1741483017852, 1741483017852),
  ('OliviaDavis', 'o2_VwXyAbCdEfGhIjKl_814', 0, 'https://avatar6.com/olivia.jpg', 'olivia.davis@example.com', '+13025102345', '莫道不销魂，帘卷西风，人比黄花瘦', '1993-03-22', 1, 1741521410917, 0, 1741483017852, 1741483017852),
  ('周强', 'o2_WxYzAbCdEfGhIjKl_815', 1, 'http://avatar.com/zhouqiang.png', 'zhouqiang@example.com', '8613512345678', '千淘万漉虽辛苦，吹尽狂沙始到金', '1989-07-10', 2, 1741521710992, 0, 1741483017852, 1741483017852),
  ('AmandaClark', 'o2_XyZaBcDeFgHiJkLm_816', 0, 'https://avatar7.com/amanda.png', 'amanda.clark@example.com', '+447412345678', '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生', '2001-04-30', 1, 1741522011067, 0, 1741483017852, 1741483017852),
  ('吴刚', 'o2_YzAbCdEfGhIjKlMn_817', 1, 'http://avatar.com/wugang.jpg', 'wugang@example.com', '8613412345678', '会当凌绝顶，一览众山小', '1986-12-25', 2, 1741522311142, 0, 1741483017852, 1741483017852),
  ('GraceKim', 'o2_ZaBcDeFgHiJkLmNo_818', 0, 'https://avatar8.com/grace.jpg', 'grace.kim@example.com', '+8613912345677', '人间有味是清欢', '1994-09-15', 1, 1741522611217, 0, 1741483017852, 1741483017852),
  ('郑晓琳', 'o2_aBcDeFgHiJkLmNoP_819', 3, 'http://avatar.com/zhengxiaolin.png', 'zhengxiaolin@example.com', '8613812345676', '采菊东篱下，悠然见南山', '1997-02-14', 1, 1741522911292, 0, 1741483017852, 1741483017852),
  ('JamesWilson', 'o2_BcDeFgHiJkLmNoPQ_820', 1, 'https://avatar9.com/james.png', 'james.wilson@example.com', '+13035102345', '路漫漫其修远兮，吾将上下而求索', '1984-06-20', 2, 1741523211367, 0, 1741483017852, 1741483017852),
  ('林悦', 'o2_cDeFgHiJkLmNoPQr_821', 0, 'https://avatar10.com/linyue.jpg', 'linyue@example.com', '8613712345676', '等闲识得东风面，万紫千红总是春', '2000-05-21', 1, 1741523511442, 0, 1741483017852, 1741483017852),
  ('MichaelThomas', 'o2_dEfGhIjKlMnOpQrS_822', 1, 'http://avatar.com/michael.png', 'michael.thomas@example.com', '8613612345676', '天生我材必有用，千金散尽还复来', '1983-11-08', 2, 1741523811517, 0, 1741483017852, 1741483017852),
  ('AmyZhou', 'o2_eFgHiJkLmNoPQrSt_823', 0, 'https://avatar11.com/amy.png', 'amy.zhou@example.com', '+8613912345675', '举杯邀明月，对影成三人', '1996-03-20', 1, 1741524111592, 0, 1741483017852, 1741483017852),
  ('周涛', 'o2_fGhIjKlMnOpQrStU_824', 1, 'http://avatar.com/zhoutao.jpg', 'zhoutao@example.com', '8613512345675', '长风破浪会有时，直挂云帆济沧海', '1985-07-12', 2, 1741524411667, 0, 1741483017852, 1741483017852),
  ('HannahMoore', 'o2_gHiJkLmNoPQrStUv_825', 0, 'https://avatar12.com/hannah.jpg', 'hannah.moore@example.com', '+447312345678', '两情若是久长时，又岂在朝朝暮暮', '1999-08-22', 1, 1741524711742, 0, 1741483017852, 1741483017852),
  ('孙丽', 'o2_hIjKlMnOpQrStUvW_826', 3, 'http://avatar.com/sunli.png', 'sunli@example.com', '8613812345674', '山重水复疑无路，柳暗花明又一村', '1991-12-15', 1, 1741525011817, 0, 1741483017852, 1741483017852),
  ('RobertJohnson', 'o2_iJkLmNoPQrStUvWx_827', 1, 'https://avatar13.com/robert.jpg', 'robert.johnson@example.com', '+13045102345', '不识庐山真面目，只缘身在此山中', '1982-09-30', 2, 1741525311892, 0, 1741483017852, 1741483017852),
  ('吴敏', 'o2_jKlMnOpQrStUvWxY_828', 0, 'https://avatar14.com/wumin.jpg', 'wumin@example.com', '8613912345673', '海上生明月，天涯共此时', '1993-04-18', 1, 1741525611967, 0, 1741483017852, 1741483017852),
  ('ChrisGarcia', 'o2_kLmNoPQrStUvWxYZ_829', 1, 'http://avatar.com/chris.png', 'chris.garcia@example.com', '8613712345673', '大江东去，浪淘尽，千古风流人物', '1981-03-15', 2, 1741525912042, 0, 1741483017852, 1741483017852),
  ('AnnaWang', 'o2_lMnOpQrStUvWxYZa_830', 0, 'https://avatar15.com/anna.jpg', 'anna.wang@example.com', '+8613812345672', '昨夜西风凋碧树，独上高楼，望尽天涯路', '1995-10-20', 1, 1741526212117, 0, 1741483017852, 1741483017852),
  ('周磊', 'o2_mNoPQrStUvWxYZab_831', 1, 'http://avatar.com/zhoulei.png', 'zhoulei@example.com', '8613612345672', '会当凌绝顶，一览众山小', '1987-06-18', 2, 1741526512192, 0, 1741483017852, 1741483017852),
  ('JessicaSmith', 'o2_nOpQrStUvWxYZabC_832', 0, 'https://avatar16.com/jessica.png', 'jessica.smith@example.com', '+447212345678', '人间四月芳菲尽，山寺桃花始盛开', '1994-02-28', 1, 1741526812267, 0, 1741483017852, 1741483017852),
  ('张婷', 'o2_oPQrStUvWxYZabCd_833', 3, 'http://avatar.com/zhangting.png', 'zhangting@example.com', '8613912345671', '停车坐爱枫林晚，霜叶红于二月花', '1992-05-20', 1, 1741527112342, 0, 1741483017852, 1741483017852),
  ('DanielBrown', 'o2_pQrStUvWxYZabCdE_834', 1, 'https://avatar17.com/daniel.jpg', 'daniel.brown@example.com', '+13055102345', '读书不觉已春深，一寸光阴一寸金', '1980-11-12', 2, 1741527412417, 0, 1741483017852, 1741483017852),
  ('林娜', 'o2_qRtSuVwXyAbCdEfGh_835', 0, 'https://avatar18.com/lina.png', 'lina@example.com', '8613712345671', '春风得意马蹄疾，一日看尽长安花', '1998-07-22', 1, 1741527712492, 0, 1741483017852, 1741483017852),
  ('MichaelDavis', 'o2_rSuVwXyAbCdEfGhIj_836', 1, 'http://avatar.com/michael.png', 'michael.davis@example.com', '8613612345671', '千磨万击还坚劲，任尔东西南北风', '1984-04-15', 2, 1741528012567, 0, 1741483017852, 1741483017852),
  ('EmilyZhang', 'o2_sTfGhIjKlMnOpQr_837', 0, 'https://avatar19.com/emily.png', 'emily.zhang@example.com', '+8613912345670', '小楼一夜听春雨，深巷明朝卖杏花', '1997-03-16', 1, 1741528312642, 0, 1741483017852, 1741483017852),
  ('王浩', 'o2_tGuHjKlMnOpQrSt_838', 1, 'http://avatar.com/wanghao.jpg', 'wanghao@example.com', '8613512345670', '长恨春归无觅处，不知转入此中来', '1989-01-15', 2, 1741528612717, 0, 1741483017852, 1741483017852),
  ('SophiaLee', 'o2_uHjKlMnOpQrStUv_839', 0, 'https://avatar20.com/sophia.png', 'sophia.lee@example.com', '+447112345678', '云想衣裳花想容，春风拂槛露华浓', '1996-06-20', 1, 1741528912792, 0, 1741483017852, 1741483017852),
  ('李强', 'o2_vJkLmNoPQrStUvWx_840', 1, 'http://avatar.com/liqiang.png', 'liqiang@example.com', '8613412345670', '曾经沧海难为水，除却巫山不是云', '1988-03-12', 2, 1741529212867, 0, 1741483017852, 1741483017852),
  ('OliviaTaylor', 'o2_wKlMnOpQrStUvWxY_841', 0, 'https://avatar21.com/olivia.png', 'olivia.taylor@example.com', '+8613912345669', '莫道不销魂，帘卷西风，人比黄花瘦', '2001-09-30', 1, 1741529512942, 0, 1741483017852, 1741483017852),
  ('周杰', 'o2_xLmNoPQrStUvWxYZa_842', 1, 'http://avatar.com/zhoujie.png', 'zhoujie@example.com', '8613712345669', '大江东去，浪淘尽，千古风流人物', '1986-08-25', 2, 1741529813017, 0, 1741483017852, 1741483017852),
  ('GraceChen', 'o2_yMnOpQrStUvWxYZab_843', 0, 'https://avatar22.com/grace.png', 'grace.chen@example.com', '+447012345678', '人间四月芳菲尽，山寺桃花始盛开', '1993-04-10', 1, 1741530113092, 0, 1741483017852, 1741483017852),
  ('陈涛', 'o2_zNpQrStUvWxYZabCd_844', 1, 'http://avatar.com/chentao.png', 'chentao@example.com', '8613612345669', '会当凌绝顶，一览众山小', '1985-12-20', 2, 1741530413167, 0, 1741483017852, 1741483017852),
  ('AmyWang', 'o2_aOpQrStUvWxYZabCe_845', 0, 'https://avatar23.com/amy.png', 'amy.wang@example.com', '+8613912345668', '停车坐爱枫林晚，霜叶红于二月花', '1994-07-15', 1, 1741530713242, 0, 1741483017852, 1741483017852),
  ('吴刚', 'o2_bPQrStUvWxYZabCdEf_846', 1, 'http://avatar.com/wugang.png', 'wugang@example.com', '8613512345668', '千磨万击还坚劲，任尔东西南北风', '1987-05-20', 2, 1741531013317, 0, 1741483017852, 1741483017852),
  ('SarahLee', 'o2_cRtSuVwXyAbCdEfGh_847', 0, 'https://avatar24.com/sarah.png', 'sarah.lee@example.com', '+447512345678', '春风又绿江南岸，明月何时照我还', '1999-02-28', 1, 1741531313392, 0, 1741483017852, 1741483017852),
  ('张浩', 'o2_dSuVwXyAbCdEfGhIj_848', 1, 'http://avatar.com/zhanghao.png', 'zhanghao@example.com', '8613712345668', '举杯邀明月，对影成三人', '1983-10-15', 2, 1741531613467, 0, 1741483017852, 1741483017852),
  ('EmilyZhang', 'o2_eTfGhIjKlMnOpQr_849', 0, 'https://avatar25.com/emily.png', 'emily.zhang@example.com', '+8613912345667', '人生如逆旅，我亦是行人', '2000-08-22', 1, 1741531913542, 0, 1741483017852, 1741483017852),
  ('王伟', 'o2_fGuHjKlMnOpQrSt_850', 1, 'http://avatar.com/wangwei.png', 'wangwei@example.com', '8613612345667', '长风破浪会有时，直挂云帆济沧海', '1984-07-10', 2, 1741532213617, 0, 1741483017852, 1741483017852);

-- 频道表 channels
INSERT INTO channels (channelId, name, description, masterId, status, humanCount, level, joinWay, createdAt, updatedAt) VALUES
  (1, '世界频道', '大家一起实现梦想的公共频道', 1, 0, 1, -1, 0, 1741509435699, 1741509435699),
  (2, 'Aqours远征群', '爱生活! 艳阳天!', 2, 0, 1, 0, 0, 1741509435699, 1741509435699),
  (3, '上财辣辣人同好会', 'みんなで叶える物語', 5, 0, 1, 1, 0, 1741509435699, 1741509435699),
  (4, '川藏线自驾联盟', 'G318国道自驾攻略分享', 7, 0, 1, 0, 0, 1741509435700, 1741509435700),
  (5, '东南亚潜水小队', '仙本那/斯米兰潜水约伴', 12, 0, 1, 1, 0, 1741509435701, 1741509435701),
  (6, '古镇漫游者', '江南六大古镇打卡指南', 18, 0, 1, 2, 0, 1741509435702, 1741509435702),
  (7, '雪山攀登计划', '哈巴/玉珠峰攀登组队', 23, 0, 1, 0, 0, 1741509435703, 1741509435703),
  (8, '环球背包客', '青旅拼房&长途路线规划', 31, 0, 1, 1, 0, 1741509435704, 1741509435704),
  (9, '美食地图挖掘', '『米其林vs街头小吃评测』', 9, 0, 1, 2, 0, 1741509435705, 1741509435705),
  (10, '房车旅行之家', '营地信息共享&车辆改装', 15, 0, 1, 0, 0, 1741509435706, 1741509435706),
  (11, '极光追猎者', '冰岛/挪威极光观测团', 28, 0, 1, 1, 0, 1741509435707, 1741509435707),
  (12, '亲子露营公社', '江浙沪优质营地推荐', 40, 0, 1, 2, 0, 1741509435708, 1741509435708),
  (13, '非遗文化之旅', '传统手工艺体验路线', 6, 0, 1, 0, 0, 1741509435709, 1741509435709),
  (14, '徒步中国', '十大经典徒步路线约伴', 14, 0, 1, 1, 0, 1741509435710, 1741509435710),
  (15, '海岛控集合', '马尔代夫选岛指南', 27, 1, 1, 2, 0, 1741509435711, 1741509435711),
  (16, '摄影旅拍小队', '无人机航拍技巧交流', 33, 0, 1, 0, 0, 1741509435712, 1741509435712),
  (17, '大学生穷游组', '火车硬座特种兵攻略', 8, 0, 1, 1, 0, 1741509435713, 1741509435713),
  (18, '滑雪搭子速配', '北海道粉雪季组队', 19, 0, 1, 2, 0, 1741509435714, 1741509435714),
  (19, '古迹探秘者', '世界遗产巡礼路线', 25, 0, 1, 0, 0, 1741509435715, 1741509435715),
  (20, '自驾丝绸之路', '河西走廊历史穿越之旅', 36, 0, 1, 1, 0, 1741509435716, 1741509435716),
  (21, '骑行318', '成都到拉萨装备清单', 4, 0, 1, 2, 0, 1741509435717, 1741509435717),
  (22, '旅居办公联盟', '数字游民签证政策解读', 11, 0, 1, 0, 0, 1741509435718, 1741509435718),
  (23, '秘境探险组', '穿越丙察察路线实况', 22, 0, 1, 1, 0, 1741509435719, 1741509435719),
  (24, '邮轮旅行指南', '地中海航线比价分析', 30, 0, 1, 2, 0, 1741509435720, 1741509435720),
  (25, '候鸟养老旅居', '三亚vs西双版纳过冬', 38, 0, 1, 0, 0, 1741509435721, 1741509435721),
  (26, '星空摄影团', '纳米比亚暗夜保护区', 17, 0, 1, 1, 0, 1741509435722, 1741509435722),
  (27, '签证互助社', '申根签slot抢约攻略', 3, 0, 1, 2, 0, 1741509435723, 1741509435723),
  (28, '民宿体验官', '网红民宿试睡报告', 10, 0, 1, 0, 0, 1741509435724, 1741509435724),
  (29, '朝圣之路', '西班牙圣地亚哥徒步', 24, 0, 1, 1, 0, 1741509435725, 1741509435725),
  (30, '公路咖啡馆', '318国道精品咖啡馆地图', 29, 0, 1, 2, 0, 1741509435726, 1741509435726),
  (31, '旅伴匹配中心', '性格测试找合拍旅友', 13, 0, 1, 0, 0, 1741509435727, 1741509435727),
  (32, '房车水电桩', '全国充电桩实时地图', 32, 0, 1, 1, 0, 1741509435728, 1741509435728),
  (33, '航司羊毛党', 'BUG机票预警信息群', 35, 0, 1, 2, 0, 1741509435729, 1741509435729),
  (34, '旅拍穿搭志', '『出片率max的旅行穿搭』', 20, 0, 1, 0, 0, 1741509435730, 1741509435730),
  (35, '宠物旅行记', '『带毛孩子出游指南』', 37, 0, 1, 1, 0, 1741509435731, 1741509435731),
  (36, '火车漫游家', '『全国观光列车时刻表』', 16, 0, 1, 2, 0, 1741509435732, 1741509435732),
  (37, '户外安全课', '『野外急救知识培训』', 39, 0, 1, 0, 0, 1741509435733, 1741509435733),
  (38, '旅图交换站', '『明信片全球互寄计划』', 26, 0, 1, 1, 0, 1741509435734, 1741509435734),
  (39, '方言课堂', '『旅行常用方言速成』', 34, 0, 1, 2, 0, 1741509435735, 1741509435735),
  (40, '古迹修复志', '『敦煌壁画修复体验』', 21, 0, 1, 0, 0, 1741509435736, 1741509435736),
  (41, '地球酒馆', '『全球精酿啤酒地图』', 7, 0, 1, 1, 0, 1741509435737, 1741509435737),
  (42, '旅居植物园', '『多肉植物跨省托运』', 5, 0, 1, 2, 0, 1741509435738, 1741509435738),
  (43, '秘境方言', '『少数民族语言学习』', 10, 0, 1, 0, 0, 1741509435739, 1741509435739),
  (44, '旅行vlog课', '『运镜剪辑技巧教学』', 19, 0, 1, 1, 0, 1741509435740, 1741509435740),
  (45, '漂流笔记本', '『全球旅行者故事接龙』', 28, 0, 1, 2, 0, 1741509435741, 1741509435741),
  (46, '非遗美食团', '『跟着舌尖去旅行』', 14, 0, 1, 0, 0, 1741509435742, 1741509435742),
  (47, '星空观测组', '『最佳观星点推荐』', 31, 0, 1, 1, 0, 1741509435743, 1741509435743),
  (48, '旅居医疗站', '『高原反应预防指南』', 9, 0, 1, 2, 0, 1741509435744, 1741509435744),
  (49, '旅行书籍社', '『Lonely Planet共读』', 23, 0, 1, 0, 0, 1741509435745, 1741509435745),
  (50, '铁路迷之家', '『全国特色火车站打卡』', 17, 0, 1, 1, 0, 1741509435746, 1741509435746),
  (51, '机场过夜组', '『全球机场休息室评测』', 35, 0, 1, 2, 0, 1741509435747, 1741509435747),
  (52, '旅行冷知识', '『各国奇怪法律科普』', 12, 0, 1, 0, 0, 1741509435748, 1741509435748);    