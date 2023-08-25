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
	"time"
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

func TestLayoutValidatorRegex(t *testing.T) {
	splitRegexTests := []struct {
		input  string
		output []string
	}{
		{
			input:  "2014-08-03",
			output: []string{"2014", "08", "03"},
		},
		{
			input:  "2014-08-03T15:59:30",
			output: []string{"2014", "08", "03", "15", "59", "30"},
		},
		{
			input:  "2014.08-03 15/59`30",
			output: []string{"2014", "08", "03", "15", "59", "30"},
		},
		{
			input:  "2014/08/03T15:59:30Z08:00",
			output: []string{"2014", "08", "03", "15", "59", "30", "08", "00"},
		},
		{
			input:  "2014\\08|03T15=59.30.999999999+08*00",
			output: []string{"2014", "08", "03", "15", "59", "30", "999999999", "08", "00"},
		},
		{
			input:  "2006-01-02T15:04:05.999999999Z07:00",
			output: []string{"2006", "01", "02", "15", "04", "05", "999999999", "07", "00"},
		},
		{
			input: "A-B C:DTE,FZG.H<I>J;K?L!M`N~O@P#Q$R%S^U&V*W|X'Y\"A(B)C{D}E[F]G/H\\I+J=L",
			output: []string{"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
				"Q", "R", "S", "U", "V", "W", "X", "Y", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L"},
		},
	}
	regex := layoutSplitRegex
	for _, test := range splitRegexTests {
		t.Run(test.input, func(t *testing.T) {
			actualOutput := regex.Split(test.input, -1)
			if !reflect.DeepEqual(actualOutput, test.output) {
				t.Fatalf("expected output %v, got %v", test.output, actualOutput)
			}
		})
	}

	stripRegexTests := []struct {
		input  string
		output string
	}{
		{
			input:  "3PM",
			output: "3",
		},
		{
			input:  "3.0PM",
			output: "3",
		},
		{
			input:  "3.9AM",
			output: "3AM",
		},
		{
			input:  "3.999999999pm",
			output: "3",
		},
		{
			input:  "2006-01-02T15:04:05.999999999Z07:00MST",
			output: "2006-01-02T15:04:05Z07:00",
		},
		{
			input:  "Jan _2 15:04:05.0000000+07:00MST",
			output: "Jan _2 15:04:05+07:00",
		},
		{
			input:  "15:04:05.99PM+07:00MST",
			output: "15:04:05+07:00",
		},
	}
	regex = layoutStripRegex
	for _, test := range stripRegexTests {
		t.Run(test.input, func(t *testing.T) {
			actualOutput := layoutStripRegex.ReplaceAllString(test.input, "")
			if !reflect.DeepEqual(actualOutput, test.output) {
				t.Fatalf("expected output %v, got %v", test.output, actualOutput)
			}
		})
	}
}

func TestCustomDateTimeParserLayoutValidation(t *testing.T) {
	correctConfig := map[string]interface{}{
		"type": "flexiblego",
		"layouts": []interface{}{
			// some custom layouts
			"2006-01-02 15:04:05.0000",
			"2006\\01\\02T03:04:05PM",
			"2006/01/02",
			"2006-01-02T15:04:05.999Z0700PMMST",
			"15:04:05.0000Z07:00 Monday",

			// standard layouts
			time.Layout,
			time.ANSIC,
			time.UnixDate,
			time.RubyDate,
			time.RFC822,
			time.RFC822Z,
			time.RFC850,
			time.RFC1123,
			time.RFC1123Z,
			time.RFC3339,
			time.RFC3339Nano,
			time.Kitchen,
			time.Stamp,
			time.StampMilli,
			time.StampMicro,
			time.StampNano,
			"2006-01-02 15:04:05", //time.DateTime
			"2006-01-02",          //time.DateOnly
			"15:04:05",            //time.TimeOnly

			// Corrected layouts to the incorrect ones below.
			"2006-01-02 03:04:05 -0700",
			"2006-01-02 15:04:05 -0700",
			"3:04PM",
			"2006-01-02 15:04:05.000 -0700 MST",
			"January 2 2006 3:04 PM",
			"02/Jan/06 3:04PM",
			"Mon 02 Jan 3:04:05 PM",
		},
	}
	for _, layout := range correctConfig["layouts"].([]interface{}) {
		if !validateDateTimeParserLayout(layout.(string)) {
			t.Fatalf("expected layout %s to be valid", layout)
		}
	}

	incorrectConfig := map[string]interface{}{
		"type": "flexiblego",
		"layouts": []interface{}{
			"2000-03-31 01:33:51 +0300",
			"2006-01-02 15:04:51 +0300",
			"2000-03-31 01:33:05 +0300",
			"4:45PM",
			"2006-01-02 15:04:05.445 -0700 MST",
			"August 20 2001 8:55 AM",
			"28/Jul/23 12:48PM",
			"Tue 22 Aug 6:37:30 AM",
		},
	}
	numExpectedErrors := len(incorrectConfig["layouts"].([]interface{}))
	numActualErrors := 0
	for _, layout := range incorrectConfig["layouts"].([]interface{}) {
		if !validateDateTimeParserLayout(layout.(string)) {
			numActualErrors++
		}
	}
	if numActualErrors != numExpectedErrors {
		t.Fatalf("expected %d errors, got: %d", numExpectedErrors, numActualErrors)
	}
}
