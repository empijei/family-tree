package main

import (
	"encoding/csv"
	"encoding/json"
	"os"
	"slices"
	"strconv"
	"strings"
	"unicode"
)

const (
	ColID          = 3
	ColNickName    = 4
	ColName        = 5
	ColSurname     = 6
	ColBirthDate   = 7
	ColDeathDate   = 8
	ColChildOf     = 9
	ColPartner     = 11
	ColWeddingDate = 12
	ColBirthPlace  = 13
	ColDeathPlace  = 14
	ColNotes       = 15
)

func must[T any](t T, err error) T {
	if err != nil {
		panic(err)
	}
	return t
}

type Person struct {
	ID      int
	Name    string
	Surname string

	NickName   string `json:",omitempty"`
	BirthDate  string `json:",omitempty"`
	DeathDate  string `json:",omitempty"`
	BirthPlace string `json:",omitempty"`
	DeathPlace string `json:",omitempty"`
	Notes      string `json:",omitempty"`

	Partner     int   `json:",omitempty"`
	Descendants []int `json:",omitempty"`

	childOf int
}

func main() {
	f := must(os.Open("pii/family.csv"))
	data := csv.NewReader(f)
	data.Comma = ','
	records := must(data.ReadAll())
	records = records[1:]
	ppl := map[int]*Person{}
	ppl[0] = &Person{Name: "Family", childOf: -1}
	for _, rec := range records {
		p := &Person{
			ID:         parseNumber(rec[ColID]),
			Name:       trim(rec[ColName]),
			Surname:    trim(rec[ColSurname]),
			NickName:   trim(rec[ColNickName]),
			BirthDate:  parseDate(rec[ColBirthDate]),
			DeathDate:  parseDate(rec[ColDeathDate]),
			BirthPlace: trim(rec[ColBirthPlace]),
			DeathPlace: trim(rec[ColDeathPlace]),
			Notes:      trim(rec[ColNotes]),
			Partner:    parseNumber(rec[ColPartner]),
			childOf:    parseNumber(rec[ColChildOf]),
		}
		if strings.EqualFold(p.NickName, p.Name) {
			p.NickName = ""
		}
		ppl[p.ID] = p
	}
	delete(ppl, -1)
	for id, p := range ppl {
		if p.Partner == -1 {
			p.Partner = 0
		}
		if p.childOf == -1 {
			continue
		}
		parent := ppl[p.childOf]
		parent.Descendants = append(parent.Descendants, id)
	}

	var tmp [][2]any
	for id, p := range ppl {
		tmp = append(tmp, [2]any{id, p})
	}
	slices.SortFunc(tmp, func(a, b [2]any) int {
		return a[0].(int) - b[0].(int)
	})
	buf := string(must(json.MarshalIndent(tmp, "", " ")))
	buf = `import { ID, Person } from '../types.js';

export const data = new Map<ID, Person>(` + buf + `);`
	os.WriteFile("../family-tree/src/pii/family.ts", []byte(buf), 0o600)
}

func parseNumber(s string) int {
	v, err := strconv.Atoi(s)
	if err != nil {
		return -1
	}
	return v
}

func parseDate(s string) string {
	var res strings.Builder
	for _, r := range s {
		switch {
		case unicode.IsNumber(r):
			res.WriteRune(r)
		case r == '/':
			res.WriteRune(r)
		}
	}
	ret := res.String()
	idx := strings.LastIndex(ret, "/")
	if idx >= 0 {
		ret = ret[idx+1:]
	}
	return ret
}

func trim(s string) string {
	return strings.TrimSpace(s)
}
