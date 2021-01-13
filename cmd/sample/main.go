//  Copyright (c) 2015 Couchbase, Inc.
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the
//  License. You may obtain a copy of the License at
//  http://www.apache.org/licenses/LICENSE-2.0 Unless required by
//  applicable law or agreed to in writing, software distributed under
//  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
//  OR CONDITIONS OF ANY KIND, either express or implied. See the
//  License for the specific language governing permissions and
//  limitations under the License.

package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	bleveMappingUI "github.com/blevesearch/bleve-mapping-ui"

	// import general purpose configuration
	_ "github.com/blevesearch/bleve/v2/config"
)

var bindAddr = flag.String("bindAddr", ":9090", "http listen address")

func main() {
	flag.Parse()

	router := mux.NewRouter()

	router.StrictSlash(true)

	bleveMappingUI.RegisterHandlers(router, "/api")

	router.PathPrefix("/").Handler(http.FileServer(http.Dir(".")))

	// start the HTTP server
	http.Handle("/", router)
	log.Printf("Listening on %v", *bindAddr)
	log.Fatal(http.ListenAndServe(*bindAddr, nil))
}
