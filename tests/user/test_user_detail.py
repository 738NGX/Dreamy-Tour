import pytest
import requests

class TestUserAPI:
  def test_get_user_detail_with_token(self, api_client, base_url) -> None:
    """
    测试携带 token 的情况
    :param api_client:
    :param base_url:
    :return:
    """
    url = f'{base_url}/user/detail'
    res = api_client.get(url)
    assert res.status_code == 200   # 状态码必须是200
    json_data = res.json()
    assert json_data['code'] == 1   # code 为 1
    data = json_data['data']
    # 必须包含的字段
    necessary_fields = ['uid', 'name', 'school', 'avatarUrl', 'gender']
    for field in necessary_fields:
      assert field in data


  def test_get_user_detail_without_token(self, base_url) -> None:
    """
    测试未携带 token 的情况
    :param base_url:
    :return:
    """
    session = requests.Session()  # 创建一个新的 Session 对象，不带任何默认头部
    url = f'{base_url}/user/detail'
    res = session.get(url)  # 不携带 Authorization 头部
    assert res.status_code == 401  # 未认证，状态码为 401
    json_data = res.json()
    assert json_data['code'] == 0  # code 为 0
