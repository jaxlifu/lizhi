#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import logging
import os
import sys

import requests
from qiniu import Auth, BucketManager

logging.basicConfig(level=logging.INFO)

access_key = 'EQTTL1RBcX1El6Iv2CXBsnlfg-LXkHIlNov8q426'
secret_key = '6jGeGSMP4AL7kV3vz7iq8-lSVwo4vSIOYpqeKevW'
q = Auth(access_key, secret_key)
bucket = BucketManager(q)
bucket_name = 'jax-lifu'
# 前缀
prefix = None
# 列举条目
limit = 1000
# 列举出除'/'的所有文件以及以'/'为分隔的所有前缀
delimiter = None
# 标记
marker = None
path = 'images/'


def getCurrentUser():
    ret, _, _ = bucket.list(bucket_name, prefix, marker, limit, delimiter)
    data = ret['items']
    users = []
    for i in range(len(data)//2):
        users.append(data[i*2]['key'].replace("_校园", ""))

    logging.info("当前有%d个人上传%s" % (len(users), users))


def main():
    if not os.path.exists(path):
        os.makedirs(path)

    ret, _, _ = bucket.list(bucket_name, prefix, marker, limit, delimiter)
    for i in ret['items']:
        base_url = 'http://img.chongchongshi.com/'+i['key']
        filename = '%s%s.jpeg' % (path, i['key'])

        if os.path.exists(filename):
            logging.info("image %s exists" % base_url)
            continue

        logging.info("down %s success" % base_url)
        # 如果空间有时间戳防盗链或是私有空间，可以调用该方法生成私有链接
        private_url = q.private_download_url(base_url, expires=100)
        r = requests.get(private_url)
        if r.content:
            with open(filename, 'wb') as f:
                f.write(r.content)
                f.flush()


if __name__ == "__main__":
    # main()
    argv = sys.argv[1:]
    if argv and argv[0] == 'down':
        main()
    else:
        getCurrentUser()
