import {  HiOutlineGlobeAlt } from 'react-icons/hi';
import {  FiTwitter } from 'react-icons/fi';

const LandingFooter = () =>{


    return (
        

        <footer className="max-w-7xl mx-auto px-8 pt-20 pb-10">

             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                 <div className="col-span-1 md:col-span-1 space-y-6">

                     <div className="flex items-center gap-2">
              
                          <span className="font-bold text-blue-600 text-lg">
                            findCourse
                          </span>
                     </div>

                       <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                         The world's leading platform for professional skill development and job placement.
                       </p>

                     <div className="flex gap-3">

                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
                             <HiOutlineGlobeAlt size={20} />
                        </div>

                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
                            <FiTwitter size={20} />
                        </div>

                    </div>
                </div>

          {[

            { title: 'Platform', links: ['All Courses', 'Job Portal', 'Instructors', 'Pricing'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
            { title: 'Support', links: ['Help Center', 'Contact Us', 'Privacy', 'Terms'] },
          ]  
          
            .map((column, i) => (

               <div key={i} className="space-y-6">

                  <h4 className="font-bold text-slate-900">
                    {column.title}
                  </h4>


                     <ul className="space-y-4">
                        {column.links.map((link, j) => (
                         <li key={j}>
                           <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition">{link}</a>
                        </li>
                           ))}
                     </ul>

              </div>

               ))}

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">

             <p className="text-xs text-slate-400">© 2024 findCourse Landing. All rights reserved.</p>

               <div className="flex gap-6 text-xs text-slate-400">
                 <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
                 <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
                 <a href="#" className="hover:text-blue-600 transition">Cookie Settings</a>
               </div>

        </div>

      </footer>
        
    )
}

export default LandingFooter;