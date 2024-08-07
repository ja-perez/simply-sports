"""
https://pymongo.readthedocs.io/en/stable/tutorial.html#documents
"""

from pymongo import MongoClient, ASCENDING

client = MongoClient()
# client = MongoClient('localhost', 27017)
# client = MongoClient('mongodb://localhost:27017/')

db = client['test_database']
# db = client.test_database

collection = db["test_collection"]
# collection = db.test_collection


import datetime
collection.delete_many({"author":"Mike"})

post = {
    "author": "Mike",
    "text": "My first blog post!",
    "tags": ["mongodb", "python", "pymongo"],
    "date": datetime.datetime.now(tz=datetime.timezone.utc),
}

post_id = collection.insert_one(post).inserted_id
print(post_id)

posts = db.posts
posts.delete_many({})
post_id = posts.insert_one(post).inserted_id
print(post_id)

print(db.list_collection_names())

import pprint
pprint.pprint(posts.find_one())

print(post_id)
pprint.pprint(posts.find_one({"_id":post_id}))

# demonstrating that an ObjectId (post_id) is not the same as its string representation (post_id_as_str)
post_id_as_str = str(post_id)
print(post_id_as_str)
print(posts.find_one({"_id":post_id_as_str}))

# Get an ObjectID from a request URL and find matching document.
# In this case: need to convert string into ObjectId before passing to find_one
from bson.objectid import ObjectId
# Web framework gets post_id from URL and passes it as a string
def get(post_id):
    document = client.db.collection.find_one({"_id"})

# Bulk Inserts
new_posts = [
    {
        "author": "Mike",
        "text": "Another post!",
        "tags": ["bulk", "insert"],
        "date": datetime.datetime(2009, 11, 12, 11, 14),
    },
    {
        "author": "Eliot",
        "title": "MongoDB is fun",
        "text": "and pretty easy too!",
        "date": datetime.datetime(2009, 11, 10, 10, 45),
    },
]
result = posts.insert_many(new_posts)
print(result.inserted_ids)

# Querying multple documents
# Use find(). find() returns a "Cursor" instance, allowing use to iterate over all matches.
print('='*90)
for post in posts.find():
    pprint.pprint(post)
print('='*90)
for post in posts.find({"author":"Mike"}):
    pprint.pprint(post)
print('='*90)

# Counting
document_count = posts.count_documents({})
print("Documents in 'posts' collection:", document_count)
mike_document_count = posts.count_documents({"author":"Mike"})
print("Documents authored by Mike in 'posts' collection:", mike_document_count)

# Range Queries
d = datetime.datetime(2009, 11, 12, 12)
print('='*90)
for post in posts.find({"date": {"$lt": d}}).sort("author"):
    pprint.pprint(post)
print('='*90)

# Indexing
result = db.profiles.create_index([("user_id", ASCENDING)], unique=True)
print(sorted(list(db.profiles.index_information())))

user_profiles = [
    {
        "user_id": 211,
        "name": "Luke",
    },
    {
        "user_id": 212,
        "name": "Ziltoid",
    },
]
db.profiles.delete_many({})
result = db.profiles.insert_many(user_profiles)

new_profile = {
    "user_id": 213,
    "name": "Drew",
}
duplicate_profile = {
    "user_id": 213,
    "name": "Tommy",
}
# This one is fine
result = db.profiles.insert_one(new_profile)
# This one results in a DuplicateKeyError
result = db.profiles.insert_one(duplicate_profile)