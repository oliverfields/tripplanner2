#!/usr/bin/env python3

import boto3


def main():

    with open('.env.local', 'r') as file:
        for line in file:
            # Print each line
            if line.startswith('VUE_APP_S3_ACCESSKEYID='):
                access_key_id = line.split('=')[1].strip()
            elif line.startswith('VUE_APP_S3_SECRETACCESSKEY='):
                secret_access_key = line.split('=')[1].strip()
            elif line.startswith('VUE_APP_S3_BUCKET='):
                bucket = line.split('=')[1].strip()
            elif line.startswith('VUE_APP_S3_ENDPOINT='):
                endpoint_url = line.split('=')[1].strip()

    s3 = boto3.resource(
        's3',
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        endpoint_url='https://' + endpoint_url
    )

    s3bucket = s3.Bucket(bucket)

    files = []
    for f in s3bucket.objects.all():
        files.append({
            'name': f.key,
            'mtime': f.last_modified,
            'size': f.size
        })

    max_show = 20
    count = 0

    print('Last modified:')
    print()
    for f in sorted(files, key=lambda f: f['mtime'], reverse=True):
        count += 1
        if count < max_show:
            print(f'{f["name"]}\t{f["size"]}\t{f["mtime"]}')
        else:
            break
    print()
    print()
    print('Largest:')
    print()
    count = 0
    for f in sorted(files, key=lambda f: f['size'], reverse=True):
        count += 1
        if count < max_show:
            print(f'{f["name"]}\t{f["size"]}\t{f["mtime"]}')
        else:
            break


if __name__ == '__main__':
    main()
