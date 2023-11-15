import React, { useState, useRef } from 'react';
import './Bus.css';


export default function Bus() {
    const [nowRoute, setNowRoute] = useState(0);
    const goSchoolData = ['07:55', '08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35', '08:40', '08:45', '08:50', '08:55', '09:00', '10:30', '10:40', '10:50', '11:00', '11:10', '11:20', '11:30', '12:50', '13:10', '13:30', '13:50', '14:00', '14:10', '14:20', '17:00', '17:20', '17:40', '18:00'];
    const goGiheungData = ['08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35', '08:40', '08:45', '08:50', '08:55', '09:00', '09:05', '09:10', '10:45', '10:55', '11:05', '11:15', '11:30', '11:35', '11:45', '13:05', '13:25', '13:45', '14:05', '14:15', '14:25', '14:35', '17:15', '17:35', '17:55', '18:15'];

    const marketing = () => {

    }

    return (
        <div className="po-abs" style={{ left: '0', top: '100%', width: '100%', height: '100vh', backgroundColor: '#eeeeee' }}>
            <div className="container flex p-2">
                <div className="form-check bus-radio">
                    <input className="form-check-input" onChange={() => setNowRoute(!nowRoute)} checked={nowRoute == 0 ? true : false}
                        type="radio" name="exampleRadios" id="exampleRadios1" value="option1" />
                    <label className="form-check-label" htmlFor="exampleRadios1">
                        기흥역 앞 노선
                    </label>
                </div>
                <div className="form-check ms-4 bus-radio">
                    <input className="form-check-input" onChange={() => setNowRoute(!nowRoute)} checked={nowRoute == 1 ? true : false}
                        type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                    <label className="form-check-label" htmlFor="exampleRadios2">
                        스타벅스 앞 노선
                    </label>
                </div>
            </div>

            <div className="container text-center bus-title">
                <div className="row">
                    <div className="col p-2">
                        이공관 방향
                    </div>
                    <div className="col p-2">
                        {nowRoute == 0 ? "기흥역" : "스타벅스"} 방향
                    </div>
                </div>
            </div>
            <div className="row bus-list" style={{overflowY: "scroll", height: "calc(100vh - 275px)", margin: "none"}}>
                <ul className="col list-group list-group-flush bus-list-group ">
                    {
                        goSchoolData.map(v => (
                            <li className="list-group-item p-4">
                                <div className="fw-bold">{v}</div>
                                <span className='disabled'>기흥 &gt; 이공관</span>
                            </li>
                        ))
                    }

                    
                </ul>
                <ul className="col list-group list-group-flush bus-list-group ">
                    <li className="list-group-item p-3">
                        <div className="fw-bold">Subheading</div>
                        <span className='disabled'>An item</span>
                    </li>
                </ul>
            </div>

        </div>
    )
}


