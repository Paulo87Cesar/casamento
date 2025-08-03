// ** CONFIGURAÇÃO SUPABASE **
// Substitua estes valores pelas suas credenciais do Supabase




const SUPABASE_URL = 'https://hylwrkgijhotowhwohzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bHdya2dpamhvdG93aHdvaHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODYzMDMsImV4cCI6MjA2OTU2MjMwM30.9Q_JAw3ucYmr9dcDShCAKe2D-jq_L7eY1xowQNyCCBw';


const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();


            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });


            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });


    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');


    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });


    const giftCheckboxes = document.querySelectorAll('.gift-checkbox');


     // Função para atualizar o estado visual de um presente
    const updateGiftUI = (giftItem, isChosen) => {
        const checkbox = giftItem.querySelector('.gift-checkbox');
        const label = giftItem.querySelector('.checkbox-container span:not(.checkmark)');
        
        if (isChosen) {
            giftItem.classList.add('selected');
            checkbox.checked = true;
            checkbox.disabled = true;
            if (label) {
                label.textContent = 'Presente já escolhido';
            }
        } else {
            giftItem.classList.remove('selected');
            checkbox.checked = false;
            checkbox.disabled = false;
            if (label) {
                label.textContent = 'Escolher este presente';
            }
        }
    };


    // Carregar o estado dos presentes do Supabase
    const loadSelectedGifts = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('presentes')
                .select('id, escolhido');

            if (error) throw error;

            const giftItems = document.querySelectorAll('.gift-item');
            
            giftItems.forEach(giftItem => {
                const giftId = giftItem.dataset.giftId;
                const giftData = data.find(item => item.id == giftId);
                
                if (giftData) {
                    updateGiftUI(giftItem, giftData.escolhido);
                }
            });

        } catch (error) {
            console.error('Erro ao carregar presentes:', error.message);
        }
    };


 // Event listener para as checkboxes dos presentes
    document.querySelectorAll('.gift-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', async function() {
            const giftItem = this.closest('.gift-item');
            const giftId = giftItem.dataset.giftId;
            const isChecked = this.checked;

            if (isChecked) {
                // Confirmar seleção do presente
                const confirmSelection = confirm('Deseja realmente escolher este presente?');
                
                if (confirmSelection) {
                    try {
                        const { data, error } = await supabaseClient
                            .from('presentes')
                            .update({ escolhido: true })
                            .eq('id', giftId)
                            .select();

                        if (error) throw error;

                        updateGiftUI(giftItem, true);
                        alert('Presente selecionado com sucesso! Obrigado!');
                    } catch (error) {
                        console.error('Erro ao marcar presente:', error.message);
                        this.checked = false;
                        alert('Não foi possível selecionar o presente. Tente novamente.');
                    }
                } else {
                    this.checked = false;
                }
            } else {
                // Confirmar desmarcação do presente
                const confirmUnselection = confirm('Deseja desmarcar este presente?\n\nSe não foi você quem marcou, por favor não altere!');
                
                if (confirmUnselection) {
                    try {
                        const { data, error } = await supabaseClient
                            .from('presentes')
                            .update({ escolhido: false })
                            .eq('id', giftId)
                            .select();

                        if (error) throw error;

                        updateGiftUI(giftItem, false);
                        alert('Presente desmarcado com sucesso!');
                    } catch (error) {
                        console.error('Erro ao desmarcar presente:', error.message);
                        this.checked = true;
                        alert('Não foi possível desmarcar o presente. Tente novamente.');
                    }
                } else {
                    this.checked = true;
                }
            }
        });
    });



    // Chama a função para carregar os presentes quando a página carrega
    loadSelectedGifts();


    // Scroll to section when the scroll-down button is clicked
    const scrollDownButton = document.querySelector('.scroll-down-button');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', () => {
            document.querySelector('#cerimonia').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }


    // Accessibility: Add focus outline for keyboard navigation
    document.body.addEventListener('keyup', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });


    // Remove focus outline when using mouse
    document.body.addEventListener('mousedown', function() {
        document.body.classList.remove('user-is-tabbing');
    });
});
