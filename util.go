package mapping

import "regexp"

// Used to validate date time parser formats
var validMagicNumbers = map[string]struct{}{
	"2006":    {},
	"06":      {}, // Year
	"01":      {},
	"1":       {},
	"_1":      {},
	"January": {},
	"Jan":     {}, // Month
	"02":      {},
	"2":       {},
	"_2":      {},
	"__2":     {},
	"002":     {},
	"Monday":  {},
	"Mon":     {}, // Day
	"15":      {},
	"3":       {},
	"03":      {}, // Hour
	"4":       {},
	"04":      {}, // Minute
	"5":       {},
	"05":      {}, // Second
	"0700":    {},
	"070000":  {},
	"07":      {},
	"00":      {},
	"":        {},
}

var layoutSplitRegex = regexp.MustCompile("[\\+\\-= :T,Z\\.<>;\\?!`~@#$%\\^&\\*|'\"\\(\\){}\\[\\]/\\\\]")

var layoutStripRegex = regexp.MustCompile(`PM|pm|\.9+|\.0+|MST`)

// date time layouts must be a combination of constants specified in golang time package
// https://pkg.go.dev/time#pkg-constants
// this validation verifies that only these constants are used in the custom layout
// for compatibility with the golang time package
func validateDateTimeParserLayout(layout string) bool {
	// first we strip out commonly used constants
	// such as "PM" which can be present in the layout
	// right after a time component, e.g. 03:04PM;
	// because regex split cannot separate "03:04PM" into
	// "03:04" and "PM". We also strip out ".9+" and ".0+"
	// which represent fractional seconds.
	layout = layoutStripRegex.ReplaceAllString(layout, "")
	// then we split the layout by non-constant characters
	// which is a regex and verify that each split is a valid magic number
	split := layoutSplitRegex.Split(layout, -1)
	for i := range split {
		_, found := validMagicNumbers[split[i]]
		if !found {
			return false
		}
	}
	return true
}
