import { FaGithub, FaLinkedin } from "react-icons/fa";
import {SiLeetcode} from "react-icons/si"
import {Link} from "react-router"

export default function Footer(){
    return(
        <footer>
            <div id="about" className="flex justify-between items-center p-10">
                <div className="w-2/3">
                    <p className="text-xl font">
                        this is a simple Ecommerce website where you can find products realted
                        Fashion,Electronics and groceries.
                    </p>
                    <p className="text-xl font-bold">Managed by SHV</p>
                </div>
                <div className="w-1/3 ml-auto justify-center flex flex-col items-end">
                    <div className="flex gap-3">
                    <a href="https://github.com/Sriharshavenkat129" target="_blank"><FaGithub size={20}/></a>
                    <a href="https://linkedin.com/in/sri-harsha-venkat-duggirala-875063291" target="_blank"><FaLinkedin size={20}/></a>
                    <a href="https://leetcode.com/u/sriharshavenkat129/"><SiLeetcode size={20}/></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}