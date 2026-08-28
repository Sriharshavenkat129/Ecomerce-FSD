import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

export default function Footer() {
    return (
        <footer id="about" className="bg-gray-900 text-white mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-8 md:p-10 gap-6">
                
                <div className="w-full md:w-2/3 text-center md:text-left">
                    <p className="text-gray-400 mb-2 max-w-lg">
                        This is a simple E-commerce website where you can find products related to Fashion, Electronics, and Groceries.
                    </p>
                    <p className="font-bold tracking-wide">Managed by SHV</p>
                </div>

                <div className="w-full md:w-1/3 flex justify-center md:justify-end gap-6">
                    <a 
                        href="https://github.com/Sriharshavenkat129" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-300"
                    >
                        <FaGithub size={28} />
                    </a>
                    <a 
                        href="https://linkedin.com/in/sri-harsha-venkat-duggirala-875063291" 
                        target="_blank" 
                        rel="noreferrer"
                        // LinkedIn Blue on hover!
                        className="text-gray-400 hover:text-[#0077b5] hover:-translate-y-1 transition-all duration-300"
                    >
                        <FaLinkedin size={28} />
                    </a>
                    <a 
                        href="https://leetcode.com/u/sriharshavenkat129/"
                        target="_blank" 
                        rel="noreferrer"
                        // LeetCode Orange on hover!
                        className="text-gray-400 hover:text-[#f89f1b] hover:-translate-y-1 transition-all duration-300"
                    >
                        <SiLeetcode size={28} />
                    </a>
                </div>
                
            </div>
        </footer>
    );
}