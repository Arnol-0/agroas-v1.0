import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, Mail, Phone } from 'lucide-react';

export default function SalesCarousel({ team = [] }) {
	const scrollRef = useRef(null);
	const [isHovering, setIsHovering] = useState(false);
	const [index, setIndex] = useState(0);
	const [quoteFor, setQuoteFor] = useState(null); // selected person for quote


				// Autoplay: cambia a la siguiente tarjeta cada 4s; pausa en hover
				useEffect(() => {
					if (!team.length) return;
					if (isHovering) return; // pausado
					const id = setInterval(() => {
						setIndex((i) => (i + 1) % team.length);
					}, 4000);
					return () => clearInterval(id);
				}, [isHovering, team.length]);

		const sanitizePhone = (num) => {
			const digits = String(num).replace(/\D/g, '');
			if (digits.startsWith('56')) return digits;
			// Assume CL phone without country code
			return digits.length === 9 ? `56${digits}` : digits;
		};

		return (
					<div
						className="group bg-white rounded-xl shadow-md ring-1 ring-green-100 p-6 relative"
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
				>
			<h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
				<Users className="text-green-700" /> Personal de ventas
			</h4>

			{/* Controles */}
					<button
						aria-label="Anterior"
						onClick={() => setIndex((i) => (i - 1 + team.length) % team.length)}
						className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow ring-1 ring-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-green-50"
						title="Anterior"
					>
						<ChevronLeft className="text-green-700" />
					</button>
					<button
						aria-label="Siguiente"
						onClick={() => setIndex((i) => (i + 1) % team.length)}
						className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow ring-1 ring-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-green-50"
						title="Siguiente"
					>
						<ChevronRight className="text-green-700" />
					</button>

			{/* Carrusel */}
					<div className="overflow-hidden" ref={scrollRef}>
						<div
							className="flex transition-transform duration-700 ease-out"
							style={{ transform: `translateX(-${index * 100}%)` }}
						>
							{team.map((person) => (
								<div key={person.email} className="w-full shrink-0 px-0">
									<div data-card className="bg-white rounded-xl p-6 shadow ring-1 ring-green-100">
										<p className="text-xs font-semibold text-green-700 tracking-wide uppercase">{person.role}</p>
										<h5 className="mt-1 text-lg font-bold text-gray-800">{person.name}</h5>
										<div className="mt-3 space-y-2 text-gray-700">
											<div className="flex items-center gap-2">
												<Mail size={18} className="text-green-700" />
												<a href={`mailto:${person.email}`} className="hover:text-green-700">{person.email}</a>
											</div>
											<div className="flex items-center gap-2">
												<Phone size={18} className="text-green-700" />
												<a href={`tel:${person.phone}`} className="hover:text-green-700">{person.phone}</a>
											</div>
										</div>
										<button
											onClick={() => setQuoteFor(person)}
											className="mt-4 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
										>
											Cotizar
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Dots */}
					{team.length > 1 && (
						<div className="mt-4 flex justify-center gap-2">
							{team.map((_, i) => (
								<button
									key={i}
									onClick={() => setIndex(i)}
									className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-green-600' : 'bg-white ring-1 ring-green-300 hover:bg-green-50'}`}
									aria-label={`Ir a la tarjeta ${i + 1}`}
								/>
							))}
						</div>
					)}

					{/* Quote Modal */}
					{quoteFor && (
						<QuoteModal
							person={quoteFor}
							onClose={() => setQuoteFor(null)}
							onSubmit={(payload) => {
								if (payload.method === 'whatsapp') {
									const dest = sanitizePhone(quoteFor.phone);
									const msg = `Hola ${quoteFor.name}, soy ${payload.name}. Mi correo es ${payload.email} y mi teléfono es ${payload.phone}. Quisiera cotizar.`;
									const url = `https://wa.me/${dest}?text=${encodeURIComponent(msg)}`;
									window.open(url, '_blank');
								} else {
									const subject = 'Cotización - Solicitud de llamada';
									const body = `Hola ${quoteFor.name},%0A%0ASoy ${payload.name}.\nCorreo: ${payload.email}\nTeléfono: ${payload.phone}\nQuisiera solicitar una llamada para cotizar.`;
									const url = `mailto:${quoteFor.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
									window.location.href = url;
								}
								setQuoteFor(null);
							}}
						/>
					)}
		</div>
	);
}

		function QuoteModal({ person, onClose, onSubmit }) {
			const [method, setMethod] = useState('llamada');
			const [name, setName] = useState('');
			const [email, setEmail] = useState('');
			const [phone, setPhone] = useState('');

			const handleSubmit = (e) => {
				e.preventDefault();
				if (!name || !email || !phone) return;
				onSubmit({ method, name, email, phone });
			};

			return (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={onClose} />
					<div className="relative bg-white rounded-xl shadow-lg ring-1 ring-green-100 w-full max-w-md p-6">
						<h5 className="text-lg font-bold text-gray-800">Cotizar con {person.name}</h5>
						<p className="text-sm text-gray-600 mt-1">Elige cómo quieres ser contactado y completa tus datos.</p>
						<form className="mt-4 space-y-3" onSubmit={handleSubmit}>
							<div className="flex items-center gap-4">
								<label className="inline-flex items-center gap-2">
									<input type="radio" name="method" value="llamada" checked={method==='llamada'} onChange={() => setMethod('llamada')} />
									<span>Solicitar llamada</span>
								</label>
								<label className="inline-flex items-center gap-2">
									<input type="radio" name="method" value="whatsapp" checked={method==='whatsapp'} onChange={() => setMethod('whatsapp')} />
									<span>Mensaje de WhatsApp</span>
								</label>
							</div>
							<div>
								<label className="block text-sm text-gray-700">Nombre completo</label>
								<input className="mt-1 w-full rounded-lg border border-green-200 p-2 focus:outline-none focus:ring-2 focus:ring-green-500" value={name} onChange={(e)=>setName(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm text-gray-700">Correo</label>
								<input type="email" className="mt-1 w-full rounded-lg border border-green-200 p-2 focus:outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e)=>setEmail(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm text-gray-700">Número de teléfono</label>
								<input className="mt-1 w-full rounded-lg border border-green-200 p-2 focus:outline-none focus:ring-2 focus:ring-green-500" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
							</div>
							<div className="flex justify-end gap-2 pt-2">
								<button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50">Cerrar</button>
								<button type="submit" className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Enviar solicitud</button>
							</div>
						</form>
					</div>
				</div>
			);
		}

