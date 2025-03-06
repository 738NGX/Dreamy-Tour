#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
@Project ：tests 
@File    ：test_post_user_avatar.py
@IDE     ：PyCharm 
@Author  ：Franctoryer
@Date    ：2025/3/6 20:13 
"""
import pytest


class TestPostUserAvatar:
    def test_successful_update_avatar(self, api_client, base_url):
        file_path = "../static/test_avatar.jpg"
        url = f"{base_url}/user/avatar"
        with open(file_path, 'rb') as file:
            response = api_client.post(
                url,
                files={"file": file}
            )

            # 验证响应状态码和消息
            assert response.status_code == 200
            resp_json = response.json()
            assert resp_json["code"] == 1


    @pytest.mark.parametrize(
        'file, status',
        [
            # 必须是图片类型的文件
            (open('../static/test.txt', 'rb'), 400),
            # 不能是空文件
            (None, 400),
        ]
    )
    def test_invalid_update_avatar(self, api_client, base_url, file, status):
        url = f"{base_url}/user/avatar"
        response = api_client.post(
            url,
            files={"file": file}
        )

        # 验证响应状态码和消息
        assert response.status_code == status
        resp_json = response.json()
        # 验证 code
        assert resp_json["code"] == 0
