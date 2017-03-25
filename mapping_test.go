//  Copyright (c) 2016 Couchbase, Inc.
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the
//  License. You may obtain a copy of the License at
//  http://www.apache.org/licenses/LICENSE-2.0 Unless required by
//  applicable law or agreed to in writing, software distributed under
//  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
//  OR CONDITIONS OF ANY KIND, either express or implied. See the
//  License for the specific language governing permissions and
//  limitations under the License.

package mapping

import (
	"encoding/json"
	"reflect"
	"testing"
)

func TestCleanse(t *testing.T) {
	m := map[string]interface{}{
		"as":  "A",
		"ai":  111,
		"amn": map[string]interface{}(nil),
		"am2": map[string]interface{}{
			"x": "X",
			"y": "Y",
		},
		"l1": []interface{}(nil),
		"l2": []interface{}{},
		"l3": []interface{}{"hello"},
	}
	m2 := Cleanse(m).(map[string]interface{})
	if !reflect.DeepEqual(m2, m) {
		m2Nice, _ := json.MarshalIndent(m2, " ", "")
		mNice, _ := json.MarshalIndent(m, " ", "")
		t.Errorf("m2 != m, m2: %#v, m: %#v\nm2: %s\nm: %s", m2, m, m2Nice, mNice)
	}

	m = map[string]interface{}{
		"as":            "A",
		"ai":            111,
		"amn":           map[string]interface{}(nil),
		"display_order": "should be cleansed away",
	}
	m2 = Cleanse(m).(map[string]interface{})
	if reflect.DeepEqual(m2, m) {
		t.Errorf("m2 == m")
	}

	m = map[string]interface{}{
		"as":            "A",
		"ai":            111,
		"amn":           map[string]interface{}(nil),
		"display_order": "should be cleansed away",
		"mm": map[string]interface{}{
			"as":            "A",
			"ai":            111,
			"amn":           map[string]interface{}(nil),
			"display_order": "should be cleansed away",
		},
	}
	m2 = Cleanse(m).(map[string]interface{})
	if reflect.DeepEqual(m2, m) {
		t.Errorf("m2 == m")
	}
	if reflect.DeepEqual(m2["mm"], m["mm"]) {
		t.Errorf("m2.mm == m.mm")
	}
	if _, exists := m2["mm"].(map[string]interface{})["display_order"]; exists {
		t.Errorf("m2.mm.display_order")
	}
}
