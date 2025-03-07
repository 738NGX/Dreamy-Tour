#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
@Project ：tests 
@File    ：test_put_user_nickname.py
@IDE     ：PyCharm 
@Author  ：Franctoryer
@Date    ：2025/3/5 20:02 
"""
import pytest


class TestPutUserNickname:
    @pytest.mark.parametrize(
        'nickname, status',
        [
            ('frank', 200),
            ('alex', 200),
            # 临界测试
            ('a', 200),   # 1 个字符
            ('a' * 10, 200),   # 10 个字符
            # 允许非 ascii 码字符
            ('朱力涛', 200),       # 中文
            ('たけおくやま', 200),  # 日文

            # 允许下划线
            ('new_name', 200),
        ]
    )
    def test_successful_put_user_nickname(self, api_client, base_url, nickname, status):
        url = f'{base_url}/user/nickname'
        body = {
            'nickname': nickname
        }
        res = api_client.put(url, json=body)
        json_data = res.json()

        # 检测状态码
        assert res.status_code == status
        # 检测 code
        assert json_data['code'] == 1


    @pytest.mark.parametrize(
        'nickname, status',
        [
            # 字符数小于 1
            ('', 400),
            # 字符数大于 10
            ('a' * 11, 400),    # 11 个字符
            ('PHP is the best programming language in the world', 400),
            ('invalid name', 400),  # 包含空格
            ('user@$', 400),  # 特殊字符
            ('<script>', 400),  # XSS尝试
        ]
    )
    def test_invalid_nickname(self, api_client, base_url, nickname, status):
        """
        昵称要求 1 < len(nickname) <= 10，太长的昵称不便前端展示
        :param api_client:
        :param base_url:
        :param nickname: 昵称
        :param status: 响应状态码
        :return:
        """
        url = f'{base_url}/user/nickname'
        body = {
            'nickname': nickname
        }
        res = api_client.put(url, json=body)
        json_data = res.json()

        # 检测状态码
        assert res.status_code == status
        # 检测 code
        assert json_data['code'] == 0


