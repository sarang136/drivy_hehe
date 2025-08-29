import React from 'react'
import { useLocation } from 'react-router-dom'


const Data = [{
    name: 'Aditya Patil',
    vehicleDetails: 'G-Wagon-R',
    number: '768743153',
    vModel: '1991',
    mail: 'nikjonas@gmail.com',
    vehicleNumber: 'MH-99 BJ 6969'
}
]


const PendingProfiles = () => {

    const location = useLocation();
    const userId = location.state.userId

    console.log(userId);


    return (
        <div>
            {
                Data && Data.map((data, index) => (
                    <div>
                        <p>{data.name}</p>
                    </div>


                ))
            }

        </div>
    )
}

export default PendingProfiles