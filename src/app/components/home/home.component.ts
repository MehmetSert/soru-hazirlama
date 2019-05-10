import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  questionForm: FormGroup;
  questions = [];
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Y', 'Z'];
  @ViewChild('column') column;
  @ViewChild('question') question;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    /*if (localStorage.getItem('questions')) {
      if (confirm('En son hazırlanmış sorular üzerinden devam etmek ister misiniz?')) {
        this.questions = JSON.parse(localStorage.getItem('questions'));
      }
    }*/
    this.form = this.fb.group({
      schoolName: '',
      lessonName: '',
      examName: '',
      classBranch: '',
      academicYear: '',
    });
    this.questionFormReset();
  }

  ngAfterViewInit() {
    console.log(this.column.value);
    if (localStorage.getItem('column')) {
      this.column.value = localStorage.getItem('column');
    }
  }

  questionFormReset() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      questionTop: '',
      answerModel: ['0', Validators.required],
      fontSize: [9, [Validators.min(6), Validators.max(15)]],
      answers: this.fb.array([])
    });
  }

  addQuestion() {
    if (!this.questionForm.invalid) {
      this.questions.push(this.questionForm.value);
      this.questionFormReset();
      this.setQuestions();
      console.log(this.questions);
      if (this.questions.length === 2) {
        this.snackBar.open('Yukarıda bulunan Tek sütun - 2 sütun seçenekleri ile soruların görünümünü değiştirebilirsiniz.', 'TAMAM', {
          duration: 5000,
        });
      }
      this.question.nativeElement.focus();
    } else {
      if (this.questionForm.get('question').invalid) {
        this.snackBar.open('Boş soru ekleyemezsiniz.', null, {
          duration: 600,
        });
      } else if (this.questionForm.get('fontSize').invalid) {
        this.snackBar.open('Yazı boyutu 6 ile 15 arasında olmalıdır.', null, {
          duration: 600,
        });
      } else {
        this.snackBar.open('Lütfen gerekli alanları doldurunuz.', null, {
          duration: 600,
        });
      }
    }
  }

  setQuestions() {
    localStorage.setItem('questions', JSON.stringify(this.questions));
  }

  createAnswer() {
    return this.fb.group({
      answer: ''
    });
  }

  get questionFormItemsArray(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer() {
    this.questionFormItemsArray.push(this.createAnswer());
  }

  removeAnswer(index) {
    this.questionFormItemsArray.removeAt(index);
  }

  removeQuestion(question) {
    this.questions.splice(this.questions.indexOf(question), 1);
    this.setQuestions();
  }

  done() {
    window.print();
  }

  changeColumn() {
    localStorage.setItem('column', this.column.value);
  }

}
