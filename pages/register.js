import {create as ipfsHttpClient} from 'ipfs-http-client';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { ethers } from 'ethers';
import Domain from '../artifacts/contracts/Domain.sol/Domain.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
import {useRouter} from 'next/router';
const Register=() => {
    const router = useRouter();
    const[file,setFile] = useState(null);
    const[price,setprice]= useState(null);
    const[formInput, updateFormInput] = useState({name:'',bio:'',period:'',twitter:''});
    async function onChange(e) {
        const file =e.target.files[0];
        console.log(file);
        const url = URL.createObjectURL(file);
        setFile(url);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x20D6c84d435bE4D72B766Bf2b4288cD8214d77B0",Domain.abi,signer);
        setprice(await contract.price(formInput.name))

    
    
    }
const createCard = async() =>{
    const element = document.getElementById('Idcard');
    let canvas = await html2canvas(element);
    let data=canvas.toDataURL('image/jpg');
    let image= convertToFile(data,"image")

    try{
        const added = await client.add(
            image,
            {progress: (prog)=> console.log(`recieved : ${prog}`)}
        )
        const url =`https://ipfs.infura.io/ipfs/${added.path}`;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x20D6c84d435bE4D72B766Bf2b4288cD8214d77B0",Domain.abi,signer);

        let transaction = await contract.register(formInput.name,url,{value:price})
        let tx = await transaction.wait();
        let records= await contract.setRecords(formInput.name, formInput.bio,formInput.period,formInput.twitter);

        router.push('/')
    }
    catch(e){
        console.log(e);
    }

}
const convertToFile =(dataurl, filename)=>{
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
return(
    <div>
        <div className=' outline p-6  bg-gradient-to-r from-purple-500 to-pink-500'>
        <h2 className="font-medium leading-tight text-4xl mt-0 mb-2 text-white">Register to Web3 Identity Services !!</h2>
        </div>
    <div className='bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4'>
        
        <div >
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder ="name"onChange={e => updateFormInput({...formInput,name:e.target.value})}/>
        </div>
        <div >
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder ="bio"onChange={e => updateFormInput({...formInput,bio:e.target.value})}/>
        </div>
        <div >
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="number" placeholder ="period"onChange={e => updateFormInput({...formInput,period:e.target.value})}/>
        </div>
        <div >
            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'  placeholder ="twitter"onChange={e => updateFormInput({...formInput,twitter:e.target.value})}/>
        </div>
        <div >
            <input  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="file" placeholder ="file" onChange={onChange}/>
        </div>
        {<div className='text-red-500'>Your card will be of { price/(10 ** 17)} Matic !!</div> || price }
        <button onClick={createCard}>Buy</button>

        <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-80 h-80 grid place-items-center outline' id ="Idcard">
        <div className='text-white font-mono'>{formInput.name}</div>
        { <img src={file} className="rounded-full" width="120" height="120" id="idImage" />||file}           
            <div className='text-white font-mono'>{formInput.bio}</div>
            <div className='text-white font-mono'>{formInput.twitter}</div>
        </div>
    </div>
    </div>
)
}
export default Register