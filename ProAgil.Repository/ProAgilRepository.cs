using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        public ProAgilContext _context { get; }

        public ProAgilRepository(ProAgilContext context)
        {
            _context = context;
        }

        #region Geral
        //Gerais
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync())> 0;
        }
        #endregion

        #region Envento
        //Evento
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrante = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedeSociais);

            if(includePalestrante)
            {
                query = query.Include(pe => pe.PalestranteEvento)
                .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderByDescending(c => c.DataEvento);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrante)
        {           
             IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedeSociais);

            if(includePalestrante)
            {
                query = query.Include(pe => pe.PalestranteEvento)
                .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderByDescending(c => c.DataEvento)
            .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));
            
            return await query.ToArrayAsync();
        }
        public async Task<Evento> GetAllEventoAsyncById(int EventoId, bool includePalestrante)
        {
             IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedeSociais);

            if(includePalestrante)
            {
                query = query.Include(pe => pe.PalestranteEvento)
                .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderByDescending(c => c.DataEvento).Where(c => c.EventoId == EventoId);

            return await query.FirstOrDefaultAsync();
        }


        #endregion

        #region Palestrante
        //Palestrante
        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEventos)
        {
           IQueryable<Palestrante> query = _context.Palestrantes
           .Include(c => c.RedeSociais);

            if(includeEventos)
            {
                query = query
                .Include(pe => pe.PalestranteEvento)
                .ThenInclude(e => e.Evento);
            }
            query = query.OrderBy(c => c.Nome)
            .Where(p => p.Nome.ToLower().Contains(name.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
           .Include(c => c.RedeSociais);

            if(includeEventos)
            {
                query = query
                .Include(pe => pe.PalestranteEvento)
                .ThenInclude(e => e.Evento);
            }
            query = query.OrderBy(p => p.Nome)
            .Where(p => p.Id == PalestranteId);

            return await query.FirstOrDefaultAsync();
        }
        #endregion
    }
}