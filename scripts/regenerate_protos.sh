#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Generate Protocol Buffers from Rippled.
##########################################################################

echo "Regenerating Protocol Buffers from Rippled"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./src/generated"

PROTO_PATH="./rippled/src/ripple/proto/"

mkdir -p $OUT_DIR

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$OUT_DIR \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR \
    --proto_path $PROTO_PATH \
    ./rippled/src/ripple/proto/rpc/v1/*.proto

# Generate typescript declaration files.
# $PWD/node_modules/grpc-tools/bin/protoc \
#     --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
#     --ts_out=$OUT_DIR \
#     --proto_path=$PROTO_PATH \
#     ./rippled/src/ripple/proto/rpc/v1/*.proto

##########################################################################
# Regenerate legacy protocol buffers.
# TODO(keefertaylor): Remove this when rippled fully supports gRPC.
##########################################################################

echo "Regenerating Protocol Buffers from xpring-common-protocol-buffers"

# Directory to write generated code to (.js and .d.ts files)
LEGACY_OUT_DIR="$OUT_DIR/legacy"

mkdir -p $LEGACY_OUT_DIR

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$LEGACY_OUT_DIR \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:$LEGACY_OUT_DIR \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

# Generate typescript declaration files.
# $PWD/node_modules/grpc-tools/bin/protoc \
#     --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
#     --ts_out=$LEGACY_OUT_DIR \
#     --proto_path=$PWD/xpring-common-protocol-buffers/proto \
#     $PWD/xpring-common-protocol-buffers/**/*.proto

echo "All done!"
