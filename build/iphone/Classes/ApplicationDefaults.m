/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"fV3qTNuhe7Ta4o2QSVRxUxFEoJGJey4F"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"dAN3F3Bqnzpp2cF9w7nHII3jq8yox4c5"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"ipaqQwYO4dCxRQY1j4KePZmavfQMQVNb"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"wfAWNF1Ab9VFPODraS7gDpMB4cXLDAov"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"Dkn4REWSH5NQoeAcoeXggIpdpqJf0qNF"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"C1mbRg6kn85wqZHxJCuVzZTYy2wiSnOn"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
