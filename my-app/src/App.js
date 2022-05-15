import React, {useState/*, useEffect*/} from "react";
import "./styles.css";

const App = () => {
    const [id, setId] = useState("");
    const [status, setStatus] = useState("Waiting for functions - Start by clicking Load players");
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [height, setHeight] = useState(180);
    const [nationality, setNationality] = useState("");
    const [disabledInput, setDisabledInput] = useState(true);
    const [disabledSearch, setDisabledSearch] = useState(true);
    const [disabledButton, setDisabledButton] = useState(true);
    const [disabledLoad, setDisabledLoad] = useState(false);

    const checkStatus = (event) => {
        event.preventDefault();
        if (status.startsWith("Editing")) {
            var dataToUpdate = {name, birthday, height, nationality};
            fetch("http://localhost:8080/api/update/" + id, {
                method: "PUT",
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dataToUpdate)
            })
            .then((results) => {
                return results.json();
            })
            .then((data) => {
                const items = data;
                console.log("Results: ", data);
                setResults(items);
                alert("The data has been updated");
                window.location.reload();
            });
        } else if (status.startsWith("Adding")) {
            var dataToAdd = {name, birthday, height, nationality};
            fetch("http://localhost:8080/api/add/", {
                method: "POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(dataToAdd)
            })
            .then((results) => {
                return results.json();
            })
            .then((data) => {
                const items = data;
                console.log("Results: ", data);
                setResults(items);
                alert("The data has been added");
                window.location.reload();
            });
        } else if (status.startsWith("Deleting")) {
            fetch("http://localhost:8080/api/delete/" + id, {
                method: "DELETE"
            })
            .then((results) => {
                return results.json();
            })
            .then((data) => {
                const items = data;
                console.log("Results: ", data);
                setResults(items);
                alert("The data has been deleted");
                window.location.reload();
            });
        } else if (status.startsWith("Waiting")) {
            alert("You need to choose a function first");
        };
    };
    const [results, setResults] = useState([]);
    const GetPlayerData = () => {
        fetch("http://localhost:8080/api/getall")
        .then((results) => {
            return results.json();
        })
        .then((data) => {
            const items = data;
            setResults(items);
        });
    };
    function emptySearchForm() {
        document.getElementById("searchForm").reset();
        GetPlayerData();
    };
    function emptyDataForm() {
        setStatus("Waiting for functions");
        setId("");
        setName("");
        setBirthday("");
        setHeight(180);
        setNationality("");
        setDisabledInput(false);
        setDisabledButton(true);
        setDisabledInput(true);
    };
    function loadPlayerData() {
        setDisabledSearch(false);
        setDisabledLoad(true);
        setStatus("Waiting for functions");
        GetPlayerData();
    };
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        };
        return age;
    };
    const PlayerArray = (props) => {
        const {data} = props;
        const [nameSearchTerm, setNameSearch] = useState("");
        const [birthyearSearchTerm, setBirthyearSearch] = useState("");
        const [ageSearchTerm, setAgeSearch] = useState("");
        const [nationalitySearchTerm, setNationalitySearch] = useState("");
        const [heightSearchTerm, setHeightSearch] = useState("");
        return (
            <div>
                <div className="row">
                    <div className="col-sm-1">
                    </div>
                    <div className="col-sm-10">  
                        <h3>Players</h3>
                        <button type="button" id="loadPlayers" className="btn btn-primary btn-block" onClick={loadPlayerData} disabled={disabledLoad}>Load players</button>
                        <button type="button" className="btn btn-outline-dark btn-block" onClick={() => {setStatus("Adding new player"); setId(""); setName(""); setBirthday(""); setHeight(180); setNationality(""); setDisabledInput(false); setDisabledButton(false); window.scrollTo(0, 0)}} disabled={disabledSearch}>Add new player</button>
                        <button type="reset" className="btn btn-outline-dark btn-block" onClick={emptySearchForm} disabled={disabledSearch}>Clear all search fields</button>
                        <form id="searchForm">
                            <input type="text" placeholder="Search by name" onChange={(event) => {setNameSearch(event.target.value)}} disabled={disabledSearch}/>
                            <input type="text" placeholder="Search by birthyear" onChange={(event) => {setBirthyearSearch(event.target.value)}} disabled={disabledSearch}/><input type="text" placeholder="Search by age" onChange={(event) => {setAgeSearch(event.target.value)}} disabled={disabledSearch}/>
                            <input type="text" placeholder="Search by height" onChange={(event) => {setHeightSearch(event.target.value)}} disabled={disabledSearch}/>
                            <input type="text" placeholder="Search by nationality" onChange={(event) => {setNationalitySearch(event.target.value)}} disabled={disabledSearch}/>
                        </form>
                        <div id="wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date of Birth (YYYY-MM-DD)</th>
                                        <th>Height (cm)</th>
                                        <th>Nationality</th>
                                    </tr>
                                </thead>
                            {data.filter((value) => {
                                var age = getAge(value.birthday);
                                if (value.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) && value.birthday.startsWith(birthyearSearchTerm) && age.toString().startsWith(ageSearchTerm) && value.height.toString().startsWith(heightSearchTerm) && value.nationality.toLowerCase().startsWith(nationalitySearchTerm.toLowerCase())) {
                                    return true;
                                }; return null;
                                }).map((value, i) => {
                                    return (
                                        <tbody key={i}>
                                            <tr>
                                                <td>{value.name}</td>
                                                <td>{value.birthday.substring(0,10) + " (" + getAge(value.birthday) + " years old)"}</td>
                                                <td>{value.height}</td>
                                                <td>{value.nationality}</td>
                                                <td><button type="button" className="btn btn-outline-dark" onClick={() => {setId(value._id); setStatus("Editing player: " + value.name); setName(value.name); setBirthday(value.birthday.substring(0,10)); setHeight(value.height); setNationality(value.nationality); setDisabledInput(false); setDisabledButton(false); window.scrollTo(0, 0)}}>Edit Player</button></td>
                                                <td><button type="button" className="btn btn-outline-danger" onClick={() => {setId(value._id); setStatus("Deleting player: " + value.name + ", press Submit to confirm"); setName(value.name); setBirthday(value.birthday.substring(0,10)); setHeight(value.height); setNationality(value.nationality); setDisabledInput(true); setDisabledButton(false); window.scrollTo(0, 0)}}>Delete Player</button></td>
                                            </tr>
                                        </tbody>
                                    );
                                })}
                            </table>
                        </div>
                        <br></br>
                        <button type="button" className="btn btn-secondary btn-lg btn-block"onClick={() => window.scrollTo(0, 0)}>Back to top</button>
                    </div>
                    <div className="col-sm-1">
                    </div>
                </div>
            </div>  
        );
    };
    return (
        <div>
            <div className="row">
                <div className="col-sm-1">
                </div>
                <div className="col-sm-10">
                    <h3>Player database</h3>
                    <h5>Current status:</h5> 
                    <h5>{status}</h5>
                </div>
                <div className="col-sm-1">
                </div>
            </div>
            <div className="row">
                <div className="col-sm-3">
                </div>
                <div className="col-sm-6">
                    <form onSubmit={checkStatus}>
                        <p>Name: <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Set name: " className="form-control" disabled={disabledInput} required/></p>
                        <p>Birthday (DD.MM.YYYY): <input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} placeholder="Set birthday: " className="form-control" disabled={disabledInput} required/></p>
                        <p>Height (CM): <input type="text" id="heightDisplay" value={height} size="1" disabled></input><input type="range" value={height} onChange={(event) => setHeight(event.target.value)} min="150" max="210" className="form-control" disabled={disabledInput}/></p>
                        <select value={nationality} onChange={(event) => setNationality(event.target.value)} disabled={disabledInput} required>
                            <option value="" disabled>Choose a nationality</option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="American Samoa">American Samoa</option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Anguilla">Anguilla</option>
                            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Aruba">Aruba</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bermuda">Bermuda</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Brazil">Brazil</option>
                            <option value="British Virgin Islands">British Virgin Islands</option>
                            <option value="Brunei Darussalam">Brunei Darussalam</option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cabo Verde">Cabo Verde</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Cayman Islands">Cayman Islands</option>
                            <option value="Central African Republic">Central African Republic</option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Chinese Taipei">Chinese Taipei</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo">Congo</option>
                            <option value="Congo DR">Congo DR</option>
                            <option value="Cook Islands">Cook Islands</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                            <option value="Croatia">Croatia</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Curaçao">Curaçao</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czech Republic">Czech Republic</option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">Dominican Republic</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Eswatini">Eswatini</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Faroe Islands">Faroe Islands</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Gibraltar">Gibraltar</option>
                            <option value="Greece">Greece</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guam">Guam</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-Bissau">Guinea-Bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran">Iran</option>
                            <option value="Iraq">Iraq</option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kosovo">Kosovo</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Laos">Laos</option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libya">Libya</option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Macau">Macau</option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Moldova">Moldova, Republic of</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montenegro">Montenegro</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="New Caledonia">New Caledonia</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="North Macedonia">North Macedonia</option>
                            <option value="Northern Ireland">Northern Ireland</option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palestine">Palestine</option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">Papua New Guinea</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Puerto Rico">Puerto Rico</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Republic of Ireland">Republic of Ireland</option>
                            <option value="Romania">Romania</option>
                            <option value="Russia">Russia</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="São Tomé and Príncipe">São Tomé and Príncipe</option> 
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Scotland">Scotland</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Serbia">Serbia</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">Solomon Islands</option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Korea">South Korea</option>
                            <option value="South Sudan">South Sudan</option>
                            <option value="Spain">Spain</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="St. Kitts and Nevis">St. Kitts and Nevis</option>
                            <option value="St. Lucia">St. Lucia</option>
                            <option value="St. Vincent and the Grenadines">St. Vincent and the Grenadines</option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syria">Syria</option>
                            <option value="Tahiti">Tahiti</option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania">Tanzania</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Timor-Leste">Timor-Leste</option>
                            <option value="Togo">Togo</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="US Virgin Islands">US Virgin Islands</option>
                            <option value="USA">USA</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Vietnam">Vietnam</option>
                            <option value="Wales">Wales</option>
                            <option value="Yemen">Yemen</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                        </select>
                        <br></br>
                        <br></br>
                        <button type="submit" className="btn btn-outline-success btn-block" disabled={disabledButton}>Submit</button>
                    </form>
                    <button type="button" className="btn btn-outline-danger btn-block" onClick={emptyDataForm} disabled={disabledButton}>Cancel</button>
                </div>
                <div className="col-sm-3">
                </div>
            </div>
            <PlayerArray data={results}/>
        </div>
    );
};

export default App;
