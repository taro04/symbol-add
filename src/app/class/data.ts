import * as SYMSDK from "symbol-sdk"

export class Data {

    public nodeUrl_main = "http://0-0-0-0-0-0-0-0-0-0.quantum-zero.com:3000" //main
    public nodeUrl_test = "http://ngl-dual-101.testnet.symboldev.network:3000" //test

    /*
    public get_repo(net:string) :SYMSDK.RepositoryFactory{
        if (net == "main")  
            return new SYMSDK.RepositoryFactoryHttp( this.nodeUrl_main );
        else
            return new SYMSDK.RepositoryFactoryHttp( this.nodeUrl_test );
    }
    */
}



