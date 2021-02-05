import plistlib
import os
from shutil import copyfile

# 参考: https://sspai.com/post/53996
# 参考: https://docs.python.org/zh-cn/3.6/library/plistlib.html

def read_reading_list():
    plist_path = os.path.join(os.environ['HOME'], 'Library/Safari/Bookmarks.plist')
    with open(plist_path, 'rb') as fp:
        root = plistlib.load(fp)
        if root['Children'] is None:
            print("Read Root Children Failed")
            return []

        main_list = root['Children']
        read_list = []
        for item in main_list:
            if item['Title'] == 'com.apple.ReadingList' and item['WebBookmarkType'] == 'WebBookmarkTypeList':
                read_list = item['Children']
                break

        result_list = list()
        for item in read_list:
            # new_item = {'title': '', 'url': '', 'date': '', 'preview': '', 'imgUrl': ''}
            new_item = dict()
            new_item['title'] = item['URIDictionary']['title']
            new_item['url'] = item['URLString']
            new_item['dateAdded'] = item['ReadingList']['DateAdded'].strftime('%Y-%m-%d %H:%M:%S')
            if 'PreviewText' in item['ReadingList'].keys():
                new_item['preview'] = item['ReadingList']['PreviewText']
            else:
                new_item['preview'] = ''

            if 'imageURL' in item.keys():
                new_item['imgUrl'] = item['imageURL']
            else:
                new_item['imgUrl'] = ''

            # print(new_item['title'])
            result_list.append(new_item)

        return result_list
    return []

        # print('======End====')
        # with open('data/ReadingList.json', 'w') as f:
        #     json.dump(result_list, f)
