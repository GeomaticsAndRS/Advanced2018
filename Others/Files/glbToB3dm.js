/*
 b3dm的组成部分：
 	28字节的头部
 		前20个字节的组成
 			magic:4
 			version:uint32
 			byteLength:unit32
 			featureTableJSONByteLength:unit32
 			featureTableBinaryLength:unit32
 			....
 		后8个字节的组成
 			batchTableJSONByteLength:unit32
 			batchTableBinaryByteLength:unit32
 	一个body
 		由三部分组成
 		featureTable
 		batchTable
 		binary gltf
 * */
/*
 Buffer.concat([header, featureTableJsonBuffer, featureTableBinaryBuffer, batchTableJsonBuffer, batchTableBinaryBuffer, glbBuffer]);
 * */
var fs = require('fs');
//console.log(fsExtra);
function getJsonBufferPadded(json, byteOffset) {
	// Check for undefined or empty
	if(!(json) || Object.keys(json).length === 0) {
		return Buffer.alloc(0);
	}
	byteOffset = byteOffset == undefined ? 0 : byteOffset;
	var string = JSON.stringify(json);

	var boundary = 8;
	var byteLength = Buffer.byteLength(string);
	var remainder = (byteOffset + byteLength) % boundary;
	var padding = (remainder === 0) ? 0 : boundary - remainder;
	var whitespace = '';
	for(var i = 0; i < padding; ++i) {
		whitespace += ' ';
	}
	string += whitespace;

	return Buffer.from(string);
}
//获得缓冲区填充
function getBufferPadded(buffer, byteOffset) {
	if(!(buffer)) {
		return Buffer.alloc(0);
	}
	byteOffset = byteOffset == undefined ? 0 : byteOffset;

	var boundary = 8;
	var byteLength = buffer.length;
	var remainder = (byteOffset + byteLength) % boundary;
	var padding = (remainder === 0) ? 0 : boundary - remainder;
	var emptyBuffer = Buffer.alloc(padding);
	return Buffer.concat([buffer, emptyBuffer]);
}

function glbToB3dm(glbBuffer, featureTableJson, featureTableBinary, batchTableJson, batchTableBinary) {
	if(!glbBuffer) {
		throw new DeveloperError('glbBuffer is not defined.');
	}

	var headerByteLength = 28;
	var featureTableJsonBuffer = getJsonBufferPadded(featureTableJson, headerByteLength);
	var featureTableBinaryBuffer = getBufferPadded(featureTableBinary);
	var batchTableJsonBuffer = getJsonBufferPadded(batchTableJson);
	var batchTableBinaryBuffer = getBufferPadded(batchTableBinary);

	var byteLength = headerByteLength + featureTableJsonBuffer.length + featureTableBinaryBuffer.length + batchTableJsonBuffer.length + batchTableBinaryBuffer.length + glbBuffer.length;
	var header = Buffer.alloc(headerByteLength);
	header.write('b3dm', 0); // magic
	header.writeUInt32LE(1, 4); // version
	header.writeUInt32LE(byteLength, 8); // byteLength - length of entire tile, including header, in bytes
	header.writeUInt32LE(featureTableJsonBuffer.length, 12); // featureTableJSONByteLength - length of feature table JSON section in bytes.
	header.writeUInt32LE(featureTableBinaryBuffer.length, 16); // featureTableBinaryByteLength - length of feature table binary section in bytes.
	header.writeUInt32LE(batchTableJsonBuffer.length, 20); // batchTableJSONByteLength - length of batch table JSON section in bytes. (0 for basic, no batches)
	header.writeUInt32LE(batchTableBinaryBuffer.length, 24); // batchTableBinaryByteLength - length of batch table binary section in bytes. (0 for basic, no batches)

	return Buffer.concat([header, featureTableJsonBuffer, featureTableBinaryBuffer, batchTableJsonBuffer, batchTableBinaryBuffer, glbBuffer]);
}

function readGlbWriteB3dm(inputPath, outputPath) {
	//var b3dm;
	var featureTableJson = {
		BATCH_LENGTH: 0
	};
	fs.readFile(inputPath,function(err,data){
		if(err){throw err;}
		console.log("读取成功！！");
		var newData = glbToB3dm(data,featureTableJson);
		fs.writeFile(outputPath,newData,function(err){
			if(err){
				throw err;
			}
			console.log("写入成功");
		});
	});

}

readGlbWriteB3dm('QITA0.glb',"output/QITA0.b3dm");
readGlbWriteB3dm('QITA05.glb',"output/QITA05.b3dm");



